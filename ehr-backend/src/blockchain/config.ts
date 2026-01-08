import { ethers } from "ethers";

/**
 * Blockchain Configuration
 * Central configuration for Web3/Blockchain connectivity
 */

export const blockchainConfig = {
    // Network Configuration
    network: {
        rpcUrl: process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545", // Ganache/Hardhat default
        chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || "1337"),
        name: process.env.BLOCKCHAIN_NETWORK_NAME || "localhost"
    },

    // Smart Contract Addresses
    contracts: {
        ehrContract: process.env.EHR_CONTRACT_ADDRESS || "",
        // Add more contract addresses as needed
    },

    // Account Configuration (for backend transactions)
    account: {
        privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || "",
    },

    // Gas Configuration
    gas: {
        limit: parseInt(process.env.GAS_LIMIT || "3000000"),
        price: process.env.GAS_PRICE || "20000000000", // 20 gwei
    }
};

/**
 * Get blockchain provider
 * @returns Ethers JSON-RPC Provider
 */
export function getProvider(): ethers.JsonRpcProvider {
    return new ethers.JsonRpcProvider(blockchainConfig.network.rpcUrl);
}

/**
 * Get signer (for transactions that require signing)
 * @returns Ethers Wallet
 */
export function getSigner(): ethers.Wallet {
    const provider = getProvider();
    
    if (!blockchainConfig.account.privateKey) {
        throw new Error("BLOCKCHAIN_PRIVATE_KEY not configured in environment");
    }

    return new ethers.Wallet(blockchainConfig.account.privateKey, provider);
}

/**
 * Validate blockchain configuration
 * @throws Error if critical configuration is missing
 */
export function validateBlockchainConfig(): void {
    const errors: string[] = [];

    if (!blockchainConfig.contracts.ehrContract) {
        errors.push("EHR_CONTRACT_ADDRESS not configured");
    }

    if (!blockchainConfig.account.privateKey) {
        errors.push("BLOCKCHAIN_PRIVATE_KEY not configured");
    }

    if (errors.length > 0) {
        console.warn("⚠️  Blockchain configuration warnings:");
        errors.forEach(err => console.warn(`   - ${err}`));
    }
}
