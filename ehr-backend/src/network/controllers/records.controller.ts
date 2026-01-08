import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import { prisma } from "@/db/prisma";
import ehrBlockchainService from "@/blockchain/ehrService";

/**
 * Medical Records Controller
 * Handles medical record listing and viewing
 * 
 * Data Flow:
 * 1. Blockchain → Record ownership verification
 * 2. Prisma → Record metadata (title, ipfsHash, fileSize, etc.)
 * 3. Combined response to frontend
 */
class RecordsController extends Api {

    /**
     * GET /records/my
     * 
     * Returns list of medical records owned by authenticated patient
     * 
     * Flow:
     * 1. Identify logged-in patient
     * 2. Query blockchain for record ownership
     * 3. Fetch metadata from Prisma
     * 4. Combine and return
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getMyRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, "Access denied. Patient role required.", 403);
                return;
            }

            // Fetch user to get blockchain address
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    // TODO: Add blockchainAddress field
                    // blockchainAddress: true
                }
            });

            if (!user) {
                this.error(res, "User not found", 404);
                return;
            }

            // TEMPORARY: Mock blockchain address
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // 🔥 BLOCKCHAIN QUERY - Get record IDs owned by patient
            const blockchainRecordIds = await ehrBlockchainService.getPatientRecordIds(patientBlockchainAddress);

            // Fetch metadata from Prisma for these records
            const records = await prisma.medicalRecord.findMany({
                where: {
                    patientId: userId,
                    // Optional: Filter by blockchain-verified IDs
                    // id: { in: blockchainRecordIds }
                },
                select: {
                    id: true,
                    title: true,
                    recordType: true,
                    ipfsHash: true,
                    encryption: true,
                    fileSize: true,
                    uploadedAt: true,
                    createdAt: true
                },
                orderBy: {
                    uploadedAt: 'desc'
                }
            });

            // Enrich with blockchain verification status
            const enrichedRecords = records.map(record => ({
                ...record,
                onBlockchain: blockchainRecordIds.includes(record.id),
                // Format file size for display
                fileSizeFormatted: this.formatFileSize(record.fileSize),
                // Truncate IPFS hash for display
                ipfsHashShort: this.truncateHash(record.ipfsHash)
            }));

            this.success(res, {
                total: enrichedRecords.length,
                records: enrichedRecords
            }, "Medical records retrieved successfully");

        } catch (error) {
            console.error("Error in getMyRecords:", error);
            next(error);
        }
    }

    /**
     * GET /records/:id
     * 
     * Returns detailed information about a specific medical record
     * 
     * Verifies:
     * 1. Record exists in database
     * 2. User owns the record (Prisma)
     * 3. Record ownership verified on blockchain
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async getRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const recordId = req.params.id;

            if (!recordId) {
                this.error(res, "Record ID is required", 400);
                return;
            }

            // Fetch record from database
            const record = await prisma.medicalRecord.findUnique({
                where: { id: recordId },
                select: {
                    id: true,
                    patientId: true,
                    title: true,
                    recordType: true,
                    ipfsHash: true,
                    encryption: true,
                    fileSize: true,
                    uploadedAt: true,
                    createdAt: true,
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            });

            if (!record) {
                this.error(res, "Medical record not found", 404);
                return;
            }

            // Verify ownership (Prisma level)
            if (record.patientId !== userId) {
                this.error(res, "Access denied. You do not own this record.", 403);
                return;
            }

            // TEMPORARY: Mock blockchain address
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // 🔥 BLOCKCHAIN VERIFICATION - Verify ownership on blockchain
            const isVerifiedOnChain = await ehrBlockchainService.verifyRecordOwnership(
                recordId,
                patientBlockchainAddress
            );

            // Prepare response
            const recordDetails = {
                ...record,
                blockchainVerified: isVerifiedOnChain,
                fileSizeFormatted: this.formatFileSize(record.fileSize),
                // Full IPFS hash for download/view
                ipfsUrl: `https://ipfs.io/ipfs/${record.ipfsHash}`
            };

            this.success(res, recordDetails, "Record details retrieved successfully");

        } catch (error) {
            console.error("Error in getRecordById:", error);
            next(error);
        }
    }

    /**
     * Format file size to human-readable format
     */
    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Truncate hash for display
     */
    private truncateHash(hash: string, length: number = 12): string {
        if (hash.length <= length) return hash;
        return `${hash.substring(0, length)}...`;
    }
}

export default RecordsController;
