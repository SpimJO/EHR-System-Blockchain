import { authMiddleware } from "@/middleware/auth";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import ProfileController from "../controllers/profile.controller";
import { Response, Request, NextFunction, Router } from "express";

const profile: Router = Router();
const profileController = new ProfileController();

/**
 * GET /users/me
 * 
 * Returns authenticated user's profile information
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * 
 * @returns {Object} User profile data
 * @returns {string} id - User ID
 * @returns {string} fullName - Full name
 * @returns {string} email - Email address
 * @returns {string} role - User role (PATIENT, DOCTOR, STAFF)
 * @returns {Date|null} dateOfBirth - Date of birth
 * @returns {string|null} gender - Gender (MALE, FEMALE, OTHER)
 * @returns {string|null} bloodGroup - Blood group
 * @returns {string|null} phoneNumber - Phone number
 * @returns {string|null} address - Address
 */
profile.route("/me").get(
    apiKeyMiddleware,
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        profileController.getMyProfile(req, res, next)
);

/**
 * PUT /users/me
 * 
 * Updates authenticated user's profile information
 * 
 * @middleware apiKeyMiddleware - Validates API key
 * @middleware authMiddleware - Validates JWT token
 * 
 * @body {string} [fullName] - Full name
 * @body {string} [dateOfBirth] - Date of birth (ISO 8601 format)
 * @body {string} [gender] - Gender (MALE, FEMALE, OTHER)
 * @body {string} [bloodGroup] - Blood group (e.g., "O+", "A-")
 * @body {string} [phoneNumber] - Phone number
 * @body {string} [address] - Full address
 * 
 * @returns {Object} Updated user profile data
 */
profile.route("/me").put(
    apiKeyMiddleware,
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        profileController.updateMyProfile(req, res, next)
);

export default profile;
