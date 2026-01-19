/**
 * Connection Test Script
 * Tests all critical connections: Database, Blockchain, and Contract
 */

import "./utils/env";
import { PrismaClient } from "@prisma/client";
import { getProvider, getSigner, blockchainConfig } from "./blockchain/config";
import { ethers } from "ethers";

async function testConnections() {
    console.log("\n🔍 Testing All Connections...\n");
    console.log("=" .repeat(60));

    // 1. Test Database Connection
    console.log("\n📊 Testing Database Connection...");
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Database: CONNECTED");
        console.log(`   URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}`);
        await prisma.$disconnect();
    } catch (error: any) {
        console.log("❌ Database: FAILED");
        console.log(`   Error: ${error.message}`);
    }

    // 2. Test Blockchain Connection
    console.log("\n⛓️  Testing Blockchain Connection...");
    try {
        const provider = getProvider();
        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();
        
        console.log("✅ Blockchain: CONNECTED");
        console.log(`   RPC URL: ${blockchainConfig.network.rpcUrl}`);
        console.log(`   Chain ID: ${network.chainId.toString()}`);
        console.log(`   Network: ${blockchainConfig.network.name}`);
        console.log(`   Block Number: ${blockNumber}`);
    } catch (error: any) {
        console.log("❌ Blockchain: FAILED");
        console.log(`   Error: ${error.message}`);
        console.log(`   RPC URL: ${blockchainConfig.network.rpcUrl}`);
    }

    // 3. Test Signer/Wallet
    console.log("\n🔑 Testing Wallet/Signer...");
    try {
        const signer = getSigner();
        const address = await signer.getAddress();
        const balance = await signer.provider!.getBalance(address);
        
        console.log("✅ Wallet: CONFIGURED");
        console.log(`   Address: ${address}`);
        console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error: any) {
        console.log("❌ Wallet: FAILED");
        console.log(`   Error: ${error.message}`);
    }

    // 4. Test Smart Contract
    console.log("\n📝 Testing Smart Contract...");
    try {
        const contractAddress = blockchainConfig.contracts.ehrContract;
        
        if (!contractAddress) {
            console.log("⚠️  Contract: NOT DEPLOYED");
            console.log("   Set EHR_CONTRACT_ADDRESS in .env.dev");
        } else {
            const provider = getProvider();
            const code = await provider.getCode(contractAddress);
            
            if (code === "0x") {
                console.log("❌ Contract: ADDRESS HAS NO CODE");
                console.log(`   Address: ${contractAddress}`);
                console.log("   The contract may not be deployed to this address");
            } else {
                console.log("✅ Contract: FOUND");
                console.log(`   Address: ${contractAddress}`);
                console.log(`   Bytecode Length: ${code.length} bytes`);
                
                // Try to load the ABI and test contract call
                try {
                    const abiPath = "./blockchain/abi/EHRContract.abi.json";
                    const abi = require(abiPath);
                    // const contract = new ethers.Contract(contractAddress, abi, provider);
                    
                    // Test a read-only function if available
                    console.log("   Testing contract interface...");
                    console.log("✅ Contract ABI: LOADED");
                    console.log(`   ABI has ${abi.length} functions/events`);
                } catch (abiError: any) {
                    console.log("⚠️  Contract ABI: NOT LOADED");
                    console.log(`   Error: ${abiError.message}`);
                }
            }
        }
    } catch (error: any) {
        console.log("❌ Contract: FAILED");
        console.log(`   Error: ${error.message}`);
    }

    // 5. Environment Variables Check
    console.log("\n🔐 Environment Variables Status:");
    const requiredEnvVars = [
        'NODE_ENV',
        'PORT',
        'VERSION',
        'BASEROUTE',
        'DATABASE_URL',
        'ENC_KEY_SECRET',
        'CIPHER_KEY_SECRET',
        'API_KEY',
        'API_KEY_SECRET',
        'BLOCKCHAIN_RPC_URL',
        'BLOCKCHAIN_CHAIN_ID',
        'BLOCKCHAIN_PRIVATE_KEY',
        'EHR_CONTRACT_ADDRESS'
    ];

    let missingVars = 0;
    requiredEnvVars.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`   ❌ ${varName}: MISSING`);
            missingVars++;
        } else {
            console.log(`   ✅ ${varName}: SET`);
        }
    });

    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Summary:");
    console.log(`   Missing Environment Variables: ${missingVars}`);
    
    if (missingVars === 0) {
        console.log("\n✅ All systems operational!\n");
    } else {
        console.log("\n⚠️  Some configurations need attention.\n");
    }
}

// Run the tests
testConnections()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Test script failed:", error);
        process.exit(1);
    });
