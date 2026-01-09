import Api from "@/lib/api";
import prisma from "@/db/prisma";
import appConfig from "@/config";
import { Bcrypt } from "@/lib/bcrypt";
import { HttpError } from "@/lib/error";
import { CipherToken } from "@/lib/token";
import { generateNonce, generateAuthMessage, verifySignature, isValidAddress } from "@/lib/metamask";
import { Request, Response, NextFunction } from "express";

// Temporary nonce storage (in production, use Redis)
const nonceStore = new Map<string, { nonce: string; createdAt: number }>();

class AuthController extends Api {
    private bcrypt = new Bcrypt()
    private httpError = new HttpError()
    private cipherToken = new CipherToken(appConfig.ENC_KEY_SECRET, appConfig.CIPHER_KEY_SECRET);

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = await req.body;

            const user = await prisma.user.findFirst({
                where: { email: email }
            })

            if (!user) {
                return this.httpError.notFound("User Not Found")
            }

            const passwordMatch = await this.bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return this.httpError.unauthorized("Invalid Credentials");
            }

            const encryptToken = await this.cipherToken.encrypt({
                id: user.id,
                name: user.name as string,
                email: user.name as string,
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
                issuedAt: Date.now()
            })

            const data = {
                token: encryptToken
            }

            this.success(res, data, "Login Route")
        } catch (error) {
            next(error)
        }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = await req.body;

            const user = await prisma.user.findUnique({
                where: { email: email }
            })

            if (user) {
                return this.httpError.conflict("Account is already taken")
            }

            const passwordHashed = await this.bcrypt.hash(password);

            await prisma.$transaction(async (tx) => {
                await tx.user.create({
                    data: {
                        name: name,
                        email: email,
                        password: passwordHashed
                    }
                })
            })

            const data = {

            }

            this.created(res, data, "Register Route")
        } catch (error) {
            next(error)
        }
    }

    public async sessionToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true
                }
            })

            const data = {
                user: user
            }

            this.success(res, data, "SessionToken")
        } catch (error) {
            next(error)
        }
    }

    /**
     * POST /auth/metamask/request-nonce
     * 
     * Generate nonce for MetaMask signature authentication
     * Step 1 of MetaMask login flow
     * 
     * @body {string} walletAddress - User's Ethereum wallet address
     * @returns {string} nonce - Random nonce to sign
     * @returns {string} message - Full message to sign
     */
    public async requestMetaMaskNonce(req: Request, res: Response, next: NextFunction) {
        try {
            const { walletAddress } = req.body;

            // Validate wallet address
            if (!walletAddress || !isValidAddress(walletAddress)) {
                return this.httpError.badRequest("Invalid wallet address");
            }

            // Generate nonce
            const nonce = generateNonce();
            const message = generateAuthMessage(nonce);

            // Store nonce temporarily (expires in 5 minutes)
            nonceStore.set(walletAddress.toLowerCase(), {
                nonce,
                createdAt: Date.now()
            });

            // Clean up expired nonces
            this.cleanupExpiredNonces();

            const data = {
                walletAddress: walletAddress.toLowerCase(),
                nonce,
                message
            };

            this.success(res, data, "Nonce generated successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/metamask/verify
     * 
     * Verify MetaMask signature and issue JWT token
     * Step 2 of MetaMask login flow
     * 
     * ⚠️ NO DATABASE STORAGE of wallet address
     * Wallet is verified dynamically, not stored
     * 
     * @body {string} walletAddress - User's Ethereum wallet address
     * @body {string} signature - Signed message from MetaMask
     * @returns {string} token - JWT token
     */
    public async verifyMetaMaskSignature(req: Request, res: Response, next: NextFunction) {
        try {
            const { walletAddress, signature } = req.body;

            // Validate inputs
            if (!walletAddress || !signature) {
                return this.httpError.badRequest("Wallet address and signature required");
            }

            if (!isValidAddress(walletAddress)) {
                return this.httpError.badRequest("Invalid wallet address");
            }

            // Get stored nonce
            const storedData = nonceStore.get(walletAddress.toLowerCase());
            if (!storedData) {
                return this.httpError.unauthorized("Nonce not found. Please request a new nonce.");
            }

            // Check if nonce expired (5 minutes)
            const NONCE_EXPIRY = 5 * 60 * 1000;
            if (Date.now() - storedData.createdAt > NONCE_EXPIRY) {
                nonceStore.delete(walletAddress.toLowerCase());
                return this.httpError.unauthorized("Nonce expired. Please request a new nonce.");
            }

            // Verify signature
            const message = generateAuthMessage(storedData.nonce);
            let recoveredAddress: string;

            try {
                recoveredAddress = verifySignature(message, signature);
            } catch (error) {
                return this.httpError.unauthorized("Invalid signature");
            }

            // Verify recovered address matches provided address
            if (recoveredAddress !== walletAddress.toLowerCase()) {
                return this.httpError.unauthorized("Signature verification failed");
            }

            // Delete used nonce
            nonceStore.delete(walletAddress.toLowerCase());

            // Find user by wallet address
            // TODO: When blockchainAddress is added to User model:
            // const user = await prisma.user.findUnique({
            //     where: { blockchainAddress: walletAddress.toLowerCase() }
            // });

            // TEMPORARY: For now, create a mock user or require registration first
            // In production, user must register with their wallet address first

            const encryptToken = await this.cipherToken.encrypt({
                id: "metamask-user", // TODO: Use actual user.id
                name: "MetaMask User",
                email: `${walletAddress}@metamask.auth`,
                walletAddress: walletAddress.toLowerCase(),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
                issuedAt: Date.now()
            });

            const data = {
                token: encryptToken,
                walletAddress: walletAddress.toLowerCase(),
                authMethod: "metamask"
            };

            this.success(res, data, "MetaMask authentication successful");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Clean up expired nonces (called periodically)
     */
    private cleanupExpiredNonces() {
        const NONCE_EXPIRY = 5 * 60 * 1000;
        const now = Date.now();

        for (const [address, data] of nonceStore.entries()) {
            if (now - data.createdAt > NONCE_EXPIRY) {
                nonceStore.delete(address);
            }
        }
    }
}

export default AuthController;