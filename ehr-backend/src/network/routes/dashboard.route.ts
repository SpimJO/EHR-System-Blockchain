import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { roleGuard } from "@/middleware/roleGuard";
import DashboardController from "../controllers/dashboard.controller";
import { Response, Request, NextFunction, Router } from "express";

const dashboard: Router = Router();
const dashboardController = new DashboardController();

/**
 * GET /dashboard/patient
 * 
 * Returns patient dashboard summary
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * @middleware roleGuard("PATIENT") - Ensures user role is PATIENT
 * 
 * @returns {Object} Dashboard data
 * @returns {Object} user - Patient info (id, fullName, email)
 * @returns {Object} cards - Dashboard cards (totalRecords, authorizedUsers, pendingRequests)
 * @returns {Array} recentActivities - Latest blockchain events
 */
dashboard.route("/patient").get(
    apiKeyMiddleware,
    authMiddleware,
    roleGuard("PATIENT"),
    (req: Request, res: Response, next: NextFunction) => 
        dashboardController.getPatientDashboard(req, res, next)
);

export default dashboard;
