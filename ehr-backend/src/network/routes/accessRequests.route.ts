import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import AccessRequestsController from "../controllers/accessRequests.controller";
import { Response, Request, NextFunction, Router } from "express";

const accessRequests: Router = Router();
const accessRequestsController = new AccessRequestsController();

/**
 * GET /access-requests/my
 * 
 * Returns list of pending access requests for authenticated patient
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @returns {Object} Response object
 * @returns {number} total - Total number of pending requests
 * @returns {Array} requests - Array of access request objects
 * @returns {string} requests[].requesterAddress - Blockchain address of requester
 * @returns {number} requests[].requestedAt - Unix timestamp
 * @returns {number} requests[].status - Request status (0=pending, 1=approved, 2=denied)
 * 
 * Data source: BLOCKCHAIN ONLY
 */
accessRequests.route("/my").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        accessRequestsController.getMyAccessRequests(req, res, next)
);

/**
 * POST /access-requests/:requesterAddress/approve
 * 
 * Approve access request from a doctor/staff
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @param {string} requesterAddress - Blockchain address of requester (URL parameter)
 * 
 * @returns {Object} Response object
 * @returns {string} transactionHash - Blockchain transaction hash
 * @returns {string} requesterAddress - Approved address
 * @returns {string} status - "approved"
 * 
 * ⚠️ BLOCKCHAIN TRANSACTION - Triggers smart contract call
 */
accessRequests.route("/:requesterAddress/approve").post(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        accessRequestsController.approveAccessRequest(req, res, next)
);

/**
 * POST /access-requests/:requesterAddress/deny
 * 
 * Deny access request from a doctor/staff
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @param {string} requesterAddress - Blockchain address of requester (URL parameter)
 * 
 * @returns {Object} Response object
 * @returns {string} transactionHash - Blockchain transaction hash
 * @returns {string} requesterAddress - Denied address
 * @returns {string} status - "denied"
 * 
 * ⚠️ BLOCKCHAIN TRANSACTION - Triggers smart contract call
 */
accessRequests.route("/:requesterAddress/deny").post(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        accessRequestsController.denyAccessRequest(req, res, next)
);

export default accessRequests;
