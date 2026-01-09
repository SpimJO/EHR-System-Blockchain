import { ethers } from "ethers";
import { getProvider, getSigner, blockchainConfig } from "./config";
import EHRContractABI from "./abi/EHRContract.abi.json";

/**
 * Interface for Access Request from blockchain
 */
export interface IAccessRequest {
    requester: string;
    requestedAt: bigint;
    status: number;
}

/**
 * Interface for Activity Event
 */
export interface IActivityEvent {
    type: "RecordUploaded" | "AccessGranted" | "AccessRevoked" | "AccessRequested";
    timestamp: number;
    details: {
        patientAddress?: string;
        recordId?: string;
        ipfsHash?: string;
        authorizedUser?: string;
        revokedUser?: string;
        requester?: string;
    };
}

/**
 * Interface for Dashboard Data
 */
export interface IDashboardData {
    totalRecords: number;
    authorizedUsers: number;
    pendingRequests: number;
    recentActivities: IActivityEvent[];
}

/**
 * Interface for Medical Record from blockchain
 */
export interface IBlockchainRecord {
    recordId: string;
    patientAddress: string;
    ipfsHash: string;
    uploadedAt: number;
    isActive: boolean;
}

/**
 * EHR Blockchain Service
 * Handles all interactions with the EHR Smart Contract
 */
class EHRBlockchainService {
    private contract: ethers.Contract;
    private provider: ethers.JsonRpcProvider;

    constructor() {
        this.provider = getProvider();
        
        // Initialize contract with read-only provider
        this.contract = new ethers.Contract(
            blockchainConfig.contracts.ehrContract,
            EHRContractABI,
            this.provider
        );
    }

    /**
     * Get patient's total record count from blockchain
     * @param patientAddress - Patient's blockchain address
     * @returns Total number of records
     */
    public async getRecordCount(patientAddress: string): Promise<number> {
        try {
            const count = await this.contract.getPatientRecordCount(patientAddress);
            return Number(count);
        } catch (error) {
            console.error("Error fetching record count:", error);
            throw new Error("Failed to fetch record count from blockchain");
        }
    }

    /**
     * Get list of authorized users for a patient
     * @param patientAddress - Patient's blockchain address
     * @returns Array of authorized user addresses
     */
    public async getAuthorizedUsers(patientAddress: string): Promise<string[]> {
        try {
            const users = await this.contract.getAuthorizedUsers(patientAddress);
            return users;
        } catch (error) {
            console.error("Error fetching authorized users:", error);
            throw new Error("Failed to fetch authorized users from blockchain");
        }
    }

    /**
     * Get pending access requests for a patient
     * @param patientAddress - Patient's blockchain address
     * @returns Array of access requests
     */
    public async getPendingRequests(patientAddress: string): Promise<IAccessRequest[]> {
        try {
            const requests = await this.contract.getPendingAccessRequests(patientAddress);
            return requests.map((req: any) => ({
                requester: req.requester,
                requestedAt: req.requestedAt,
                status: req.status
            }));
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            throw new Error("Failed to fetch pending requests from blockchain");
        }
    }

    /**
     * Get recent activities from blockchain events
     * @param patientAddress - Patient's blockchain address
     * @param limit - Maximum number of events to fetch
     * @returns Array of activity events
     */
    public async getRecentActivities(patientAddress: string, limit: number = 10): Promise<IActivityEvent[]> {
        try {
            // Get current block number
            const currentBlock = await this.provider.getBlockNumber();
            const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

            // Query all relevant events
            const eventTypes = [
                "RecordUploaded",
                "AccessGranted",
                "AccessRevoked",
                "AccessRequested"
            ];

            const allEvents: IActivityEvent[] = [];

            for (const eventType of eventTypes) {
                const filter = this.contract.filters[eventType](patientAddress);
                const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);

                for (const event of events) {
                    const block = await event.getBlock();
                    const eventLog = event as ethers.EventLog;
                    
                    allEvents.push({
                        type: eventType as any,
                        timestamp: block.timestamp,
                        details: this.parseEventDetails(eventType, eventLog.args)
                    });
                }
            }

            // Sort by timestamp descending and limit
            return allEvents
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, limit);

        } catch (error) {
            console.error("Error fetching recent activities:", error);
            throw new Error("Failed to fetch recent activities from blockchain");
        }
    }

    /**
     * Get complete audit log from blockchain events
     * Returns ALL events for a patient (immutable audit trail)
     * 
     * ⚠️ This is the authoritative source for audit logs
     * @param patientAddress - Patient's blockchain address
     * @param options - Filter options (limit, offset, actionType)
     * @returns Array of audit log entries with transaction hashes
     */
    public async getAuditLog(
        patientAddress: string,
        options?: {
            limit?: number;
            offset?: number;
            actionType?: string;
        }
    ): Promise<Array<{
        action: string;
        actor: string;
        timestamp: number;
        transactionHash: string;
        blockNumber: number;
        details: any;
    }>> {
        try {
            // Get current block number
            const currentBlock = await this.provider.getBlockNumber();
            const fromBlock = 0; // Start from genesis for COMPLETE audit trail

            // Query all relevant events
            const eventTypes = [
                "RecordUploaded",
                "AccessGranted",
                "AccessRevoked",
                "AccessRequested"
            ];

            const allAuditEntries: any[] = [];

            for (const eventType of eventTypes) {
                // Skip if filtering by specific action type
                if (options?.actionType && eventType !== options.actionType) {
                    continue;
                }

                const filter = this.contract.filters[eventType](patientAddress);
                const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);

                for (const event of events) {
                    const block = await event.getBlock();
                    const tx = await event.getTransaction();
                    const eventLog = event as ethers.EventLog;
                    
                    allAuditEntries.push({
                        action: eventType,
                        actor: tx.from, // Who performed the action
                        timestamp: block.timestamp,
                        transactionHash: event.transactionHash,
                        blockNumber: event.blockNumber,
                        details: this.parseEventDetails(eventType, eventLog.args)
                    });
                }
            }

            // Sort by timestamp descending (newest first)
            allAuditEntries.sort((a, b) => b.timestamp - a.timestamp);

            // Apply pagination
            const offset = options?.offset || 0;
            const limit = options?.limit || allAuditEntries.length;

            return allAuditEntries.slice(offset, offset + limit);

        } catch (error) {
            console.error("Error fetching audit log:", error);
            throw new Error("Failed to fetch audit log from blockchain");
        }
    }

    /**
     * Parse event arguments into activity details
     */
    private parseEventDetails(eventType: string, args: any): any {
        switch (eventType) {
            case "RecordUploaded":
                return {
                    patientAddress: args.patientAddress,
                    recordId: args.recordId,
                    ipfsHash: args.ipfsHash
                };
            case "AccessGranted":
                return {
                    patientAddress: args.patientAddress,
                    authorizedUser: args.authorizedUser
                };
            case "AccessRevoked":
                return {
                    patientAddress: args.patientAddress,
                    revokedUser: args.revokedUser
                };
            case "AccessRequested":
                return {
                    patientAddress: args.patientAddress,
                    requester: args.requester
                };
            default:
                return {};
        }
    }

    /**
     * Get complete dashboard data for a patient
     * @param patientAddress - Patient's blockchain address
     * @returns Dashboard data aggregated from blockchain
     */
    public async getPatientDashboard(patientAddress: string): Promise<IDashboardData> {
        try {
            // Execute all queries in parallel for performance
            const [recordCount, authorizedUsers, pendingRequests, recentActivities] = await Promise.all([
                this.getRecordCount(patientAddress),
                this.getAuthorizedUsers(patientAddress),
                this.getPendingRequests(patientAddress),
                this.getRecentActivities(patientAddress, 10)
            ]);

            return {
                totalRecords: recordCount,
                authorizedUsers: authorizedUsers.length,
                pendingRequests: pendingRequests.length,
                recentActivities
            };
        } catch (error) {
            console.error("Error fetching patient dashboard:", error);
            throw new Error("Failed to fetch dashboard data from blockchain");
        }
    }

    /**
     * Get patient's medical record IDs from blockchain
     * @param patientAddress - Patient's blockchain address
     * @returns Array of record IDs owned by patient
     */
    public async getPatientRecordIds(patientAddress: string): Promise<string[]> {
        try {
            // Query blockchain for RecordUploaded events by this patient
            const currentBlock = await this.provider.getBlockNumber();
            const fromBlock = 0; // Start from genesis for complete history

            const filter = this.contract.filters.RecordUploaded(patientAddress);
            const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);

            // Extract record IDs from events
            const recordIds = events.map(event => {
                const eventLog = event as ethers.EventLog;
                return eventLog.args?.recordId;
            }).filter(Boolean);

            return recordIds;
        } catch (error) {
            console.error("Error fetching patient record IDs:", error);
            throw new Error("Failed to fetch record IDs from blockchain");
        }
    }

    /**
     * Verify record ownership on blockchain
     * @param recordId - Record ID to verify
     * @param patientAddress - Patient's blockchain address
     * @returns True if patient owns the record
     */
    public async verifyRecordOwnership(recordId: string, patientAddress: string): Promise<boolean> {
        try {
            const recordIds = await this.getPatientRecordIds(patientAddress);
            return recordIds.includes(recordId);
        } catch (error) {
            console.error("Error verifying record ownership:", error);
            return false;
        }
    }

    /**
     * Upload medical record to blockchain
     * @param recordId - Unique record identifier
     * @param ipfsHash - IPFS hash of encrypted file
     * @returns Transaction hash
     */
    public async uploadRecord(recordId: string, ipfsHash: string): Promise<string> {
        try {
            const signer = getSigner();
            const contractWithSigner = this.contract.connect(signer) as any;

            const tx = await contractWithSigner.uploadRecord(recordId, ipfsHash);
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error) {
            console.error("Error uploading record to blockchain:", error);
            throw new Error("Failed to upload record to blockchain");
        }
    }

    /**
     * Request access to patient's records (Doctor/Staff)
     * @param patientAddress - Patient's blockchain address
     * @returns Transaction hash
     */
    public async requestAccess(patientAddress: string): Promise<string> {
        try {
            const signer = getSigner();
            const contractWithSigner = this.contract.connect(signer) as any;

            const tx = await contractWithSigner.requestAccess(patientAddress);
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error) {
            console.error("Error requesting access:", error);
            throw new Error("Failed to request access");
        }
    }

    /**
     * Approve access request (Patient)
     * @param requesterAddress - Address of doctor/staff requesting access
     * @returns Transaction hash
     */
    public async approveAccess(requesterAddress: string): Promise<string> {
        try {
            const signer = getSigner();
            const contractWithSigner = this.contract.connect(signer) as any;

            const tx = await contractWithSigner.approveAccess(requesterAddress);
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error) {
            console.error("Error approving access:", error);
            throw new Error("Failed to approve access");
        }
    }

    /**
     * Deny access request (Patient)
     * @param requesterAddress - Address of doctor/staff requesting access
     * @returns Transaction hash
     */
    public async denyAccess(requesterAddress: string): Promise<string> {
        try {
            const signer = getSigner();
            const contractWithSigner = this.contract.connect(signer) as any;

            const tx = await contractWithSigner.denyAccess(requesterAddress);
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error) {
            console.error("Error denying access:", error);
            throw new Error("Failed to deny access");
        }
    }

    /**
     * Revoke previously granted access (Patient)
     * @param authorizedAddress - Address of user to revoke access from
     * @returns Transaction hash
     */
    public async revokeAccess(authorizedAddress: string): Promise<string> {
        try {
            const signer = getSigner();
            const contractWithSigner = this.contract.connect(signer) as any;

            const tx = await contractWithSigner.revokeAccess(authorizedAddress);
            const receipt = await tx.wait();

            return receipt.hash;
        } catch (error) {
            console.error("Error revoking access:", error);
            throw new Error("Failed to revoke access");
        }
    }

    /**
     * Get transaction details from blockchain
     * @param transactionHash - Transaction hash to query
     * @returns Transaction and receipt details
     */
    public async getTransactionDetails(transactionHash: string): Promise<{
        transaction: any;
        receipt: any;
        block: any;
    } | null> {
        try {
            const tx = await this.provider.getTransaction(transactionHash);
            const receipt = await this.provider.getTransactionReceipt(transactionHash);

            if (!tx || !receipt) {
                return null;
            }

            const block = await this.provider.getBlock(receipt.blockNumber);

            return { transaction: tx, receipt, block };
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            return null;
        }
    }
}

// Export singleton instance
export default new EHRBlockchainService();
