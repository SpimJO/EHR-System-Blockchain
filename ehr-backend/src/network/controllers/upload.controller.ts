import Api from "@/lib/api";
import { Request, Response, NextFunction } from "express";
import { prisma } from "@/db/prisma";
import ehrBlockchainService from "@/blockchain/ehrService";
import { encryptFile } from "@/lib/encryption";
import { uploadToIPFS } from "@/lib/ipfs";
import multer from "multer";

/**
 * Upload Controller
 * Handles medical record upload with encryption and blockchain logging
 * 
 * Flow:
 * 1. Validate metadata
 * 2. Generate AES-128 key
 * 3. Encrypt file
 * 4. Upload to IPFS
 * 5. Write to blockchain
 * 6. Save metadata to Prisma
 */

// Configure multer for file upload (memory storage)
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

class UploadController extends Api {

    /**
     * POST /upload/record
     * 
     * Upload medical record with encryption
     * 
     * Request:
     * - Multipart form-data
     * - Fields: title, recordType, uploadedAt, description (optional)
     * - File: medical record file
     * 
     * Flow (CRITICAL ORDER):
     * 1. Validate metadata
     * 2. Encrypt file with AES-128
     * 3. Upload encrypted file to IPFS
     * 4. Write record to blockchain (owner + ipfsHash)
     * 5. Save metadata to Prisma
     * 6. Return success with record details
     * 
     * @access Protected - Requires JWT + Role: PATIENT
     */
    public async uploadRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            // Validate user is patient
            if (userRole !== "PATIENT") {
                this.error(res, "Access denied. Patient role required.", 403);
                return;
            }

            // Validate file exists
            if (!req.file) {
                this.error(res, "No file uploaded", 400);
                return;
            }

            // Extract metadata from request body
            const {
                title,
                recordType,
                uploadedAt,
                description // Optional, UI-only
            } = req.body;

            // Validate required fields
            if (!title) {
                this.error(res, "Title is required", 400);
                return;
            }

            // Parse upload date
            let recordDate: Date;
            if (uploadedAt) {
                recordDate = new Date(uploadedAt);
                if (isNaN(recordDate.getTime())) {
                    this.error(res, "Invalid date format", 400);
                    return;
                }
            } else {
                recordDate = new Date(); // Default to now
            }

            // Get file info
            const fileBuffer = req.file.buffer;
            const fileName = req.file.originalname;
            const fileSize = req.file.size;

            console.log(`📄 Processing file: ${fileName} (${fileSize} bytes)`);

            // STEP 1: Encrypt file with AES-128
            console.log("🔒 Encrypting file...");
            const { encryptedBuffer, key: encryptionKey, iv } = encryptFile(fileBuffer);

            // STEP 2: Upload encrypted file to IPFS
            console.log("☁️  Uploading to IPFS...");
            const ipfsHash = await uploadToIPFS(encryptedBuffer, `${fileName}.encrypted`);
            console.log(`✅ IPFS upload successful: ${ipfsHash}`);

            // Generate unique record ID
            const recordId = `${userId}-${Date.now()}`;

            // Get user blockchain address
            // TODO: Replace with actual user.blockchainAddress
            const patientBlockchainAddress = process.env.MOCK_PATIENT_ADDRESS || "0x0000000000000000000000000000000000000000";

            // STEP 3: Write to blockchain (THIS HAPPENS BEFORE PRISMA)
            console.log("⛓️  Writing to blockchain...");
            const txHash = await ehrBlockchainService.uploadRecord(recordId, ipfsHash);
            console.log(`✅ Blockchain transaction: ${txHash}`);

            // STEP 4: Save metadata to Prisma (AFTER blockchain confirmation)
            console.log("💾 Saving metadata to database...");
            const medicalRecord = await prisma.medicalRecord.create({
                data: {
                    id: recordId,
                    patientId: userId!,
                    title,
                    recordType: recordType || null,
                    ipfsHash,
                    encryption: "AES-128",
                    fileSize,
                    uploadedAt: recordDate
                }
            });

            console.log(`✅ Record created: ${medicalRecord.id}`);

            // Prepare response
            const response = {
                record: {
                    id: medicalRecord.id,
                    title: medicalRecord.title,
                    recordType: medicalRecord.recordType,
                    ipfsHash: medicalRecord.ipfsHash,
                    fileSize: medicalRecord.fileSize,
                    uploadedAt: medicalRecord.uploadedAt,
                    encryption: medicalRecord.encryption
                },
                blockchain: {
                    transactionHash: txHash,
                    verified: true
                },
                // ⚠️ IMPORTANT: Encryption key must be securely stored by patient
                // In production, this should be encrypted with patient's public key
                encryptionKey,
                iv,
                warning: "Store your encryption key securely. It cannot be recovered if lost."
            };

            this.success(res, response, "Medical record uploaded successfully");

        } catch (error) {
            console.error("Error in uploadRecord:", error);
            next(error);
        }
    }
}

export default UploadController;
