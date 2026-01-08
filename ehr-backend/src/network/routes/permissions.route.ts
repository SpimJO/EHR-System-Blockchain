import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import PermissionsController from "../controllers/permissions.controller";
import { Response, Request, NextFunction, Router } from "express";

const permissions: Router = Router();
const permissionsController = new PermissionsController();

/**
 * GET /permissions/my
 * 
 * Returns list of users with granted access to patient's records
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @returns {Object} Response object
 * @returns {number} total - Total number of authorized users
 * @returns {Array} permissions - Array of permission objects
 * @returns {string} permissions[].userAddress - Blockchain address of authorized user
 * @returns {boolean} permissions[].isActive - Permission status
 * 
 * Data source: BLOCKCHAIN ONLY
 */
permissions.route("/my").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        permissionsController.getMyPermissions(req, res, next)
);

/**
 * POST /permissions/:userAddress/revoke
 * 
 * Revoke access from a previously authorized user
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @param {string} userAddress - Blockchain address of user to revoke (URL parameter)
 * 
 * @returns {Object} Response object
 * @returns {string} transactionHash - Blockchain transaction hash
 * @returns {string} revokedAddress - Revoked address
 * @returns {string} status - "revoked"
 * 
 * ⚠️ BLOCKCHAIN TRANSACTION - Triggers smart contract call
 */
permissions.route("/:userAddress/revoke").post(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        permissionsController.revokePermission(req, res, next)
);

export default permissions;
