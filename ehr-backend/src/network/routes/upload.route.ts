import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import UploadController, { upload } from "../controllers/upload.controller";
import { Response, Request, NextFunction, Router } from "express";

const uploadRoute: Router = Router();
const uploadController = new UploadController();

/**
 * POST /upload/record
 * 
 * Upload medical record with encryption and blockchain logging
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * @middleware upload.single("file") - Handles file upload (max 10MB)
 * 
 * Request (multipart/form-data):
 * @body {string} title - Record title (required)
 * @body {string} [recordType] - Type of record (e.g., "Prescription", "Lab Result")
 * @body {string} [uploadedAt] - Record date (ISO 8601 format, defaults to now)
 * @body {string} [description] - Optional description (UI-only, not stored)
 * @body {File} file - Medical record file (required)
 * 
 * Response:
 * @returns {Object} record - Record metadata
 * @returns {Object} blockchain - Blockchain transaction details
 * @returns {string} encryptionKey - AES-128 encryption key (BASE64)
 * @returns {string} iv - Initialization vector (BASE64)
 * @returns {string} warning - Security warning about encryption key
 * 
 * Flow:
 * 1. Validate metadata
 * 2. Encrypt file with AES-128
 * 3. Upload to IPFS
 * 4. Write to blockchain
 * 5. Save metadata to Prisma
 */
uploadRoute.route("/record").post(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => 
        uploadController.uploadRecord(req, res, next)
);

export default uploadRoute;
