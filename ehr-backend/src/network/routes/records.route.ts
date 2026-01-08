import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import RecordsController from "../controllers/records.controller";
import { Response, Request, NextFunction, Router } from "express";

const records: Router = Router();
const recordsController = new RecordsController();

/**
 * GET /records/my
 * 
 * Returns list of medical records owned by authenticated patient
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @returns {Object} Response object
 * @returns {number} total - Total number of records
 * @returns {Array} records - Array of medical record objects
 * @returns {string} records[].id - Record ID
 * @returns {string} records[].title - Record title
 * @returns {string} records[].recordType - Type of record (e.g., "Prescription")
 * @returns {string} records[].ipfsHash - IPFS hash reference
 * @returns {string} records[].ipfsHashShort - Truncated hash for display
 * @returns {string} records[].encryption - Encryption method (e.g., "AES-128")
 * @returns {number} records[].fileSize - File size in bytes
 * @returns {string} records[].fileSizeFormatted - Human-readable file size
 * @returns {Date} records[].uploadedAt - Upload timestamp
 * @returns {boolean} records[].onBlockchain - Blockchain verification status
 */
records.route("/my").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        recordsController.getMyRecords(req, res, next)
);

/**
 * GET /records/:id
 * 
 * Returns detailed information about a specific medical record
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @param {string} id - Record ID (URL parameter)
 * 
 * @returns {Object} Record details
 * @returns {string} id - Record ID
 * @returns {string} title - Record title
 * @returns {string} recordType - Type of record
 * @returns {string} ipfsHash - Full IPFS hash
 * @returns {string} ipfsUrl - IPFS gateway URL
 * @returns {string} encryption - Encryption method
 * @returns {number} fileSize - File size in bytes
 * @returns {string} fileSizeFormatted - Human-readable file size
 * @returns {Date} uploadedAt - Upload timestamp
 * @returns {boolean} blockchainVerified - Blockchain ownership verification
 * @returns {Object} patient - Patient information
 */
records.route("/:id").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        recordsController.getRecordById(req, res, next)
);

export default records;
