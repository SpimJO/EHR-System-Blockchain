import Api from "@/lib/api";
import prisma from "@/db/prisma";
import appConfig from "@/config";
import { Bcrypt } from "@/lib/bcrypt";
import { HttpError } from "@/lib/error";
import { CipherToken } from "@/lib/token";
import { generateNonce, generateAuthMessage, verifySignature, isValidAddress } from "@/lib/metamask";
import { generateWallet, encryptPrivateKey } from "@/lib/blockchain-wallet";
import { Request, Response, NextFunction } from "express";

// Temporary nonce storage (in production, use Redis)
const nonceStore = new Map<string, { nonce: string; createdAt: number }>();

class AuthController extends Api {
    private bcrypt = new Bcrypt()
    private httpError = new HttpError()
    private cipherToken = new CipherToken(appConfig.ENC_KEY_SECRET, appConfig.CIPHER_KEY_SECRET);

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = await req.body;

            const user = await prisma.user.findFirst({
                where: { email: email }
            })

            if (!user) {
                next(this.httpError.notFound("User Not Found"));
                return;
            }

            const passwordMatch = await this.bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                next(this.httpError.unauthorized("Invalid Credentials"));
                return;
            }

            const encryptToken = await this.cipherToken.encrypt({
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
                issuedAt: Date.now()
            })

            const data = {
                accessToken: encryptToken,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }

            this.success(res, data, "Login Route")
        } catch (error) {
            next(error)
        }
    }

    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                fullName, email, password, role,
                gender, dateOfBirth, phoneNumber,
                specialty, licenseNumber, department, employeeId, bloodGroup
            } = req.body;

            // Validation
            if (!fullName || !email || !password || !role) {
                this.error(res, 400, "Full name, email, password, and role are required");
                return;
            }

            if (!['PATIENT', 'DOCTOR', 'STAFF'].includes(role)) {
                this.error(res, 400, "Invalid role. Must be PATIENT, DOCTOR, or STAFF");
                return;
            }

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email }
            });

            if (existingUser) {
                next(this.httpError.conflict("Account is already taken"));
                return;
            }

            // Hash password
            const passwordHashed = await this.bcrypt.hash(password);

            // Generate blockchain wallet
            const wallet = generateWallet();
            const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

            console.log(`🔐 Generated blockchain wallet for ${email}: ${wallet.address}`);

            // Create user with blockchain address
            await prisma.$transaction(async (tx) => {
                // Create user
                const newUser = await tx.user.create({
                    data: {
                        fullName: fullName,
                        email: email,
                        password: passwordHashed,
                        role: role,
                        blockchainAddress: wallet.address,
                        privateKeyHash: encryptedPrivateKey
                    }
                });

                // Create role-specific profile
                if (role === 'DOCTOR') {
                    await tx.doctorProfile.create({
                        data: {
                            userId: newUser.id,
                            designation: 'Doctor',
                            specialization: specialty || 'General',
                            licenseNumber: licenseNumber,
                            phoneNumber: phoneNumber,
                            // If doctor has department, add it here too if needed, but UI only asks for specialty
                        }
                    });
                } else if (role === 'STAFF') {
                    await tx.staffProfile.create({
                        data: {
                            userId: newUser.id,
                            designation: 'Staff',
                            department: department || 'General',
                            employeeId: employeeId,
                            phoneNumber: phoneNumber
                        }
                    });
                } else if (role === 'PATIENT') {
                    await tx.patientProfile.create({
                        data: {
                            userId: newUser.id,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
                            gender: gender || 'OTHER',
                            bloodGroup: bloodGroup || 'UNKNOWN',
                            phoneNumber: phoneNumber
                        }
                    });
                }
            });

            this.created(res, {
                blockchainAddress: wallet.address
            }, "User registered successfully with blockchain wallet");

        } catch (error) {
            console.error("Error in register:", error);
            next(error);
        }
    }

    public async sessionToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    fullName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
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
    public async requestMetaMaskNonce(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { walletAddress } = req.body;

            // Debug logging
            console.log("📝 MetaMask Nonce Request:");
            console.log("  - Body:", req.body);
            console.log("  - walletAddress:", walletAddress);
            console.log("  - isValid:", walletAddress ? isValidAddress(walletAddress) : 'undefined');

            // Validate wallet address
            if (!walletAddress || !isValidAddress(walletAddress)) {
                next(this.httpError.badRequest("Invalid wallet address"));
                return;
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
    public async verifyMetaMaskSignature(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { walletAddress, signature } = req.body;

            // Validate inputs
            if (!walletAddress || !signature) {
                next(this.httpError.badRequest("Wallet address and signature required"));
                return;
            }

            if (!isValidAddress(walletAddress)) {
                next(this.httpError.badRequest("Invalid wallet address"));
                return;
            }

            // Get stored nonce
            const storedData = nonceStore.get(walletAddress.toLowerCase());
            if (!storedData) {
                next(this.httpError.unauthorized("Nonce not found. Please request a new nonce."));
                return;
            }

            // Check if nonce expired (5 minutes)
            const NONCE_EXPIRY = 5 * 60 * 1000;
            if (Date.now() - storedData.createdAt > NONCE_EXPIRY) {
                nonceStore.delete(walletAddress.toLowerCase());
                next(this.httpError.unauthorized("Nonce expired. Please request a new nonce."));
                return;
            }

            // Verify signature
            const message = generateAuthMessage(storedData.nonce);
            let recoveredAddress: string;

            try {
                recoveredAddress = verifySignature(message, signature);
            } catch (error) {
                next(this.httpError.unauthorized("Invalid signature"));
                return;
            }

            // Verify recovered address matches provided address
            if (recoveredAddress !== walletAddress.toLowerCase()) {
                next(this.httpError.unauthorized("Signature verification failed"));
                return;
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