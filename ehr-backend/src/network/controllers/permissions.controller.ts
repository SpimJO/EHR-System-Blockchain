import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import ehrBlockchainService from "@/blockchain/ehrService";

/**
 * Permissions Controller
 * Handles viewing and revoking granted access permissions
 * 
 * ⚠️ PURE BLOCKCHAIN OPERATIONS - NO PRISMA WRITES
 * 
 * Flow:
 * 1. Read granted permissions from blockchain
 * 2. Revoke triggers blockchain transaction
 * 3. Blockchain emits audit event
 */
class PermissionsController extends Api {

    /**
     * GET /permissions/my
     * 
     * Returns list of users who have been granted access to patient's records
     * 
     * Data source: BLOCKCHAIN ONLY
     * - Reads authorized users from smart contract
     * - Optionally enriches with user names from Prisma (read-only)
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getMyPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Get patient blockchain address
            // TODO: Replace with actual user.blockchainAddress
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // 🔥 BLOCKCHAIN QUERY - Get authorized users
            const authorizedUsers = await ehrBlockchainService.getAuthorizedUsers(patientBlockchainAddress);

            // Enrich with user details from Prisma (optional, read-only)
            const enrichedPermissions = await Promise.all(
                authorizedUsers.map(async (userAddress) => {
                    // TODO: When blockchainAddress is added to User model:
                    // const user = await prisma.user.findUnique({
                    //     where: { blockchainAddress: userAddress },
                    //     select: { 
                    //         fullName: true, 
                    //         role: true, 
                    //         email: true 
                    //     }
                    // });

                    return {
                        userAddress,
                        // userName: user?.fullName || "Unknown User",
                        // userRole: user?.role || "Unknown",
                        // userEmail: user?.email || null,
                        grantedAt: null, // Can be fetched from AccessGranted events
                        isActive: true
                    };
                })
            );

            this.success(res, {
                total: enrichedPermissions.length,
                permissions: enrichedPermissions
            }, "Permissions retrieved successfully");

        } catch (error) {
            console.error("Error in getMyPermissions:", error);
            next(error);
        }
    }

    /**
     * POST /permissions/:userAddress/revoke
     * 
     * Revoke access from a previously authorized user
     * 
     * ⚠️ BLOCKCHAIN TRANSACTION - NO PRISMA WRITE
     * 
     * Flow:
     * 1. Validate user address
     * 2. Verify user currently has access (optional check)
     * 3. Call smart contract revokeAccess()
     * 4. Blockchain emits AccessRevoked event
     * 5. Return transaction hash
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async revokePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userRole = req.user?.role;
            const authorizedAddress = req.params.userAddress;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, 403, "Access denied. Patient role required.");
                return;
            }

            // Validate authorized address
            if (!authorizedAddress || !authorizedAddress.startsWith("0x")) {
                this.error(res, 400, "Invalid user address");
                return;
            }

            // Get patient blockchain address
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // Optional: Verify user currently has access
            const authorizedUsers = await ehrBlockchainService.getAuthorizedUsers(patientBlockchainAddress);
            if (!authorizedUsers.includes(authorizedAddress)) {
                this.error(res, 400, "User does not have access to revoke");
                return;
            }

            console.log(`🚫 Revoking access for: ${authorizedAddress}`);

            // 🔥 BLOCKCHAIN TRANSACTION - Revoke access
            const txHash = await ehrBlockchainService.revokeAccess(authorizedAddress);

            console.log(`⛓️  Transaction hash: ${txHash}`);

            this.success(res, {
                transactionHash: txHash,
                revokedAddress: authorizedAddress,
                status: "revoked"
            }, "Access revoked successfully");

        } catch (error) {
            console.error("Error in revokePermission:", error);
            next(error);
        }
    }
}

export default PermissionsController;
