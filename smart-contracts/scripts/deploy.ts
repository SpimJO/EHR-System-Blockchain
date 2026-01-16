import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying EHR Smart Contract...");
  console.log("");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying from account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy the contract
  console.log("📦 Deploying EHRContract...");
  const EHRContract = await ethers.getContractFactory("EHRContract");
  const contract = await EHRContract.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  
  console.log("");
  console.log("✅ EHR Contract deployed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Contract Address:", address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("⚙️  Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add to ehr-backend/.env.dev:");
  console.log(`   EHR_CONTRACT_ADDRESS=${address}`);
  console.log("3. Restart your backend server");
  console.log("");

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const recordCount = await contract.getPatientRecordCount(deployer.address);
  console.log("✓ Contract is functional! Initial record count:", recordCount.toString());
  
  console.log("");
  console.log("🎉 Deployment complete!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  });

