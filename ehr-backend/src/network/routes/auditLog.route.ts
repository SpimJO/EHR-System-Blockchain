import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import AuditLogController from "../controllers/auditLog.controller";
import { Response, Request, NextFunction, Router } from "express";

const auditLog: Router = Router();
const auditLogController = new AuditLogController();

/**
 * GET /audit-log/my
 * 
 * Returns complete audit log for authenticated patient
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @query {number} [limit=50] - Maximum entries to return (1-100)
 * @query {number} [offset=0] - Pagination offset
 * @query {string} [actionType] - Filter by action type
 * 
 * @returns {Object} Response object
 * @returns {number} total - Total number of entries returned
 * @returns {number} offset - Current offset
 * @returns {number} limit - Current limit
 * @returns {boolean} immutable - Always true (blockchain-backed)
 * @returns {string} source - "Ethereum Blockchain"
 * @returns {Array} entries - Audit log entries
 * @returns {string} entries[].action - Action type
 * @returns {string} entries[].description - Human-readable description
 * @returns {string} entries[].actor - Blockchain address of actor
 * @returns {number} entries[].timestamp - Unix timestamp
 * @returns {string} entries[].date - ISO 8601 date
 * @returns {string} entries[].transactionHash - Ethereum transaction hash
 * @returns {number} entries[].blockNumber - Block number
 * @returns {string} entries[].etherscanUrl - Verification URL
 * 
 * Data source: BLOCKCHAIN EVENTS ONLY (NO DATABASE)
 */
auditLog.route("/my").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        auditLogController.getMyAuditLog(req, res, next)
);

/**
 * GET /audit-log/:transactionHash/verify
 * 
 * Verify a specific audit log entry on blockchain
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * 
 * @param {string} transactionHash - Ethereum transaction hash (URL parameter)
 * 
 * @returns {Object} Verification details
 * @returns {string} transactionHash - Transaction hash
 * @returns {number} blockNumber - Block number
 * @returns {string} blockHash - Block hash
 * @returns {number} timestamp - Unix timestamp
 * @returns {string} date - ISO 8601 date
 * @returns {string} from - Sender address
 * @returns {string} to - Recipient address
 * @returns {string} status - "success" or "failed"
 * @returns {string} gasUsed - Gas consumed
 * @returns {number} confirmations - Number of confirmations
 * @returns {boolean} verified - Always true if found
 * @returns {string} etherscanUrl - Etherscan verification URL
 * 
 * Use this endpoint to prove audit log entry authenticity
 */
auditLog.route("/:transactionHash/verify").get(
    apiKeyMiddleware,
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        auditLogController.verifyAuditEntry(req, res, next)
);

export default auditLog;
