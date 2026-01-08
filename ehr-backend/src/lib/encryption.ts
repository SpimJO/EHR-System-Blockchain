import crypto from "crypto";

/**
 * AES-128 Encryption Utility
 * Used for encrypting medical records before IPFS upload
 */

const ALGORITHM = "aes-128-cbc";
const KEY_LENGTH = 16; // 128 bits = 16 bytes
const IV_LENGTH = 16;

/**
 * Generate a random AES-128 encryption key
 * @returns Base64-encoded encryption key
 */
export function generateEncryptionKey(): string {
    const key = crypto.randomBytes(KEY_LENGTH);
    return key.toString("base64");
}

/**
 * Encrypt file buffer using AES-128
 * @param fileBuffer - File content to encrypt
 * @param encryptionKey - Base64-encoded encryption key (optional, generates if not provided)
 * @returns Object containing encrypted buffer, key, and IV
 */
export function encryptFile(
    fileBuffer: Buffer,
    encryptionKey?: string
): {
    encryptedBuffer: Buffer;
    key: string;
    iv: string;
} {
    // Generate key if not provided
    const key = encryptionKey
        ? Buffer.from(encryptionKey, "base64")
        : crypto.randomBytes(KEY_LENGTH);

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt
    const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
    ]);

    return {
        encryptedBuffer: encrypted,
        key: key.toString("base64"),
        iv: iv.toString("base64")
    };
}

/**
 * Decrypt file buffer using AES-128
 * @param encryptedBuffer - Encrypted file content
 * @param encryptionKey - Base64-encoded encryption key
 * @param iv - Base64-encoded initialization vector
 * @returns Decrypted buffer
 */
export function decryptFile(
    encryptedBuffer: Buffer,
    encryptionKey: string,
    iv: string
): Buffer {
    const key = Buffer.from(encryptionKey, "base64");
    const ivBuffer = Buffer.from(iv, "base64");

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);

    // Decrypt
    const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final()
    ]);

    return decrypted;
}

/**
 * Generate a secure hash of the encryption key for verification
 * @param encryptionKey - Base64-encoded encryption key
 * @returns SHA-256 hash of the key
 */
export function hashEncryptionKey(encryptionKey: string): string {
    return crypto
        .createHash("sha256")
        .update(encryptionKey)
        .digest("hex");
}
