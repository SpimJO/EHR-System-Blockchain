import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import ehrBlockchainService from "@/blockchain/ehrService";

/**
 * Audit Log Controller
 * Provides immutable audit trail from blockchain events
 * 
 * ⚠️ PURE BLOCKCHAIN READ - NO PRISMA TABLE
 * 
 * Paper: "Audit Log page gives the Patient User an unchangeable record
 * of all medical data actions, including the date, time, and a hash
 * on the Ethereum blockchain for full proof and tracking."
 */
class AuditLogController extends Api {

    /**
     * GET /audit-log/my
     * 
     * Returns complete audit log for authenticated patient
     * 
     * Data source: BLOCKCHAIN EVENTS ONLY
     * - RecordUploaded
     * - AccessGranted
     * - AccessRevoked
     * - AccessRequested
     * 
     * Each entry includes:
     * - Action type
     * - Actor address
     * - Timestamp
     * - Transaction hash (proof)
     * - Block number (immutability proof)
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getMyAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Extract query parameters for filtering/pagination
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const actionType = req.query.actionType as string | undefined;

            // Validate pagination params
            if (limit < 1 || limit > 100) {
                this.error(res, 400, "Limit must be between 1 and 100");
                return;
            }

            if (offset < 0) {
                this.error(res, 400, "Offset must be non-negative");
                return;
            }

            // Get patient blockchain address
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { blockchainAddress: true }
            });

            if (!user || !user.blockchainAddress) {
                this.error(res, 400, "Blockchain address not found. Please contact support.");
                return;
            }

            const patientBlockchainAddress = user.blockchainAddress;

            console.log(`📜 Fetching audit log for: ${patientBlockchainAddress}`);

            // 🔥 BLOCKCHAIN QUERY - Get complete audit trail
            const auditEntries = await ehrBlockchainService.getAuditLog(
                patientBlockchainAddress,
                {
                    limit,
                    offset,
                    actionType
                }
            );

            // Format response with human-readable descriptions
            const formattedEntries = auditEntries.map(entry => ({
                action: entry.action,
                description: this.generateAuditDescription(entry.action, entry.details),
                actor: entry.actor,
                timestamp: entry.timestamp,
                date: new Date(entry.timestamp * 1000).toISOString(),
                transactionHash: entry.transactionHash,
                blockNumber: entry.blockNumber,
                etherscanUrl: this.getEtherscanUrl(entry.transactionHash),
                details: entry.details
            }));

            this.success(res, {
                total: formattedEntries.length,
                offset,
                limit,
                entries: formattedEntries,
                immutable: true,
                source: "Ethereum Blockchain"
            }, "Audit log retrieved successfully");

        } catch (error) {
            console.error("Error in getMyAuditLog:", error);
            next(error);
        }
    }

    /**
     * GET /audit-log/:transactionHash/verify
     * 
     * Verify a specific audit log entry on blockchain
     * 
     * Returns transaction details for proof verification
     * 
     * @access Protected - Requires JWT
     */
    public async verifyAuditEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transactionHash = req.params.transactionHash;

            if (!transactionHash || !transactionHash.startsWith("0x")) {
                this.error(res, 400, "Invalid transaction hash");
                return;
            }

            console.log(`🔍 Verifying transaction: ${transactionHash}`);

            // Query blockchain for transaction details
            const txDetails = await ehrBlockchainService.getTransactionDetails(transactionHash);

            if (!txDetails) {
                this.error(res, 404, "Transaction not found on blockchain");
                return;
            }

            const { transaction: tx, receipt, block } = txDetails;

            const verificationDetails = {
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                blockHash: receipt.blockHash,
                timestamp: block?.timestamp || 0,
                date: block ? new Date(block.timestamp * 1000).toISOString() : null,
                from: tx.from,
                to: tx.to,
                status: receipt.status === 1 ? "success" : "failed",
                gasUsed: receipt.gasUsed.toString(),
                confirmations: await tx.confirmations(),
                verified: true,
                etherscanUrl: this.getEtherscanUrl(transactionHash)
            };

            this.success(res, verificationDetails, "Transaction verified on blockchain");

        } catch (error) {
            console.error("Error in verifyAuditEntry:", error);
            next(error);
        }
    }

    /**
     * Generate human-readable description for audit entry
     */
    private generateAuditDescription(action: string, details: any): string {
        switch (action) {
            case "RecordUploaded":
                return `New medical record uploaded to IPFS`;
            case "AccessGranted":
                return `Access granted to ${details.authorizedUser}`;
            case "AccessRevoked":
                return `Access revoked from ${details.revokedUser}`;
            case "AccessRequested":
                return `Access requested by ${details.requester}`;
            default:
                return `${action} performed`;
        }
    }

    /**
     * Generate Etherscan URL for transaction verification
     */
    private getEtherscanUrl(transactionHash: string): string {
        const network = process.env.BLOCKCHAIN_NETWORK_NAME || "localhost";
        
        // Map network to Etherscan URL
        const etherscanUrls: Record<string, string> = {
            mainnet: `https://etherscan.io/tx/${transactionHash}`,
            goerli: `https://goerli.etherscan.io/tx/${transactionHash}`,
            sepolia: `https://sepolia.etherscan.io/tx/${transactionHash}`,
            localhost: `http://localhost:8545/tx/${transactionHash}`
        };

        return etherscanUrls[network] || `#${transactionHash}`;
    }
}

export default AuditLogController;
