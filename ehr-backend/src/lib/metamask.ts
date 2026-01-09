import { ethers } from "ethers";

/**
 * MetaMask Signature Verification Utility
 * 
 * Handles signature-based authentication without storing wallet addresses
 * Paper: "Secure authentication using MetaMask"
 */

/**
 * Generate authentication message for user to sign
 * @param nonce - Random nonce for this authentication attempt
 * @returns Message string to be signed
 */
export function generateAuthMessage(nonce: string): string {
    return `Welcome to EHR Blockchain System\n\nSign this message to authenticate.\n\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
}

/**
 * Generate random nonce for authentication
 * @returns Random hex string
 */
export function generateNonce(): string {
    return ethers.hexlify(ethers.randomBytes(32));
}

/**
 * Verify MetaMask signature
 * @param message - Original message that was signed
 * @param signature - Signature from MetaMask
 * @returns Recovered wallet address
 */
export function verifySignature(message: string, signature: string): string {
    try {
        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase();
    } catch (error) {
        console.error("Error verifying signature:", error);
        throw new Error("Invalid signature");
    }
}

/**
 * Verify signature and compare with expected address
 * @param message - Original message
 * @param signature - Signature from MetaMask
 * @param expectedAddress - Expected wallet address
 * @returns True if signature is valid and matches expected address
 */
export function verifySignatureMatch(
    message: string,
    signature: string,
    expectedAddress: string
): boolean {
    try {
        const recoveredAddress = verifySignature(message, signature);
        return recoveredAddress === expectedAddress.toLowerCase();
    } catch (error) {
        return false;
    }
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
}
