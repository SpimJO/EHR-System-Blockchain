import crypto from "crypto";
import { ethers } from "ethers";
import appConfig from "@/config";
import prisma from "@/db/prisma";

/**
 * Blockchain Wallet Management Library
 * Handles backend-generated Ethereum wallets for users
 * 
 * Security: Private keys are encrypted using AES-256-GCM before storage
 */

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = Buffer.from(appConfig.ENC_KEY_SECRET, "hex"); // 32 bytes

/**
 * Generate new Ethereum wallet
 * @returns Wallet with address and private key
 */
export function generateWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address, // Public address (0x...)
        privateKey: wallet.privateKey, // Private key (0x...)
    };
}

/**
 * Encrypt private key for secure storage
 * @param privateKey - Ethereum private key to encrypt
 * @returns Encrypted string format: iv:authTag:encryptedData
 */
export function encryptPrivateKey(privateKey: string): string {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedData
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt private key for transaction signing
 * @param encryptedData - Encrypted private key
 * @returns Decrypted private key
 */
export function decryptPrivateKey(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

    if (!ivHex || !authTagHex || !encrypted) {
        throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

/**
 * Get user's wallet instance for transaction signing
 * @param userId - User ID
 * @returns Ethers.js Wallet instance connected to provider
 */
export async function getUserWallet(userId: string): Promise<ethers.Wallet> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            privateKeyHash: true,
            blockchainAddress: true,
        },
    });

    if (!user?.privateKeyHash || !user?.blockchainAddress) {
        throw new Error("User does not have blockchain wallet");
    }

    const privateKey = decryptPrivateKey(user.privateKeyHash);

    // Import provider from blockchain config
    const { getProvider } = await import("@/blockchain/config");
    const provider = getProvider();

    return new ethers.Wallet(privateKey, provider);
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns true if valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
    try {
        return ethers.isAddress(address);
    } catch {
        return false;
    }
}

/**
 * Get checksummed Ethereum address
 * @param address - Address to checksum
 * @returns Checksummed address
 */
export function getChecksumAddress(address: string): string {
    return ethers.getAddress(address);
}
