import { authMiddleware } from "@/middleware/auth";
import AuthController from "../controllers/auth.controller";
import { apiKeyMiddleware } from "@/middleware/apiKey";
import { Response, Request, NextFunction, Router } from "express";


const auth: Router = Router();
const authController = new AuthController();

/**
 * POST /auth/login
 * Traditional email/password login
 */
auth.route("/login").post(
    apiKeyMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        authController.login(req, res, next)
);

/**
 * POST /auth/register
 * User registration with email/password
 */
auth.route("/register").post(
    apiKeyMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        authController.register(req, res, next)
);

/**
 * POST /auth/sessionToken
 * Verify current session token
 */
auth.route("/sessionToken").post(
    apiKeyMiddleware,
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        authController.sessionToken(req, res, next)
);

/**
 * POST /auth/metamask/request-nonce
 * 
 * Request nonce for MetaMask signature authentication
 * Step 1: Generate nonce for user to sign
 * 
 * @body {string} walletAddress - User's Ethereum wallet address
 * 
 * @returns {string} nonce - Random nonce
 * @returns {string} message - Full message to sign with MetaMask
 */
auth.route("/metamask/request-nonce").post(
    apiKeyMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        authController.requestMetaMaskNonce(req, res, next)
);

/**
 * POST /auth/metamask/verify
 * 
 * Verify MetaMask signature and issue JWT token
 * Step 2: Verify signed message
 * 
 * @body {string} walletAddress - User's Ethereum wallet address
 * @body {string} signature - Signed message from MetaMask
 * 
 * @returns {string} token - JWT authentication token
 * @returns {string} walletAddress - Verified wallet address
 * @returns {string} authMethod - "metamask"
 * 
 * ⚠️ Wallet address is verified dynamically, NOT stored in database
 */
auth.route("/metamask/verify").post(
    apiKeyMiddleware,
    (req: Request, res: Response, next: NextFunction) => 
        authController.verifyMetaMaskSignature(req, res, next)
);

export default auth;