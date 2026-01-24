# 🚀 DEPLOYMENT GUIDE - Updated with .env

**Now using environment variables for security!** ✅

---

## 📋 **SETUP STEPS**

### **Step 1: Create .env File**

Create `smart-contracts/.env`:

```bash
cd smart-contracts
cp .env.example .env
```

**Or create manually with your Ganache credentials:**

```env
# Ganache Configuration
GANACHE_RPC_URL=http://127.0.0.1:7545
GANACHE_CHAIN_ID=5777
GANACHE_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

**Your Ganache Account (0):**
- **Address:** `0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9`
- **Private Key:** `0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7`

---

### **Step 2: Install Dependencies**

```bash
npm install
npm install --save-dev dotenv
```

---

### **Step 3: Compile Contract**

```bash
npm run compile
```

**Expected:**
```
Compiled 1 Solidity file successfully
```

---

### **Step 4: Deploy to Ganache**

```bash
npm run deploy:ganache
```

**Expected Output:**
```
🚀 Deploying EHR Smart Contract...
📍 Deploying from account: 0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9
💰 Account balance: 100.0 ETH
✅ EHR Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**COPY THE CONTRACT ADDRESS!** ⬆️

---

### **Step 5: Add Contract Address to Backend**

Create/Update `ehr-backend/.env.dev`:

```env
# Your deployed contract address
EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Your Ganache credentials
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

---

## ✅ **SECURITY BENEFITS**

### **✅ With .env (Current):**
```typescript
// hardhat.config.ts
accounts: process.env.GANACHE_PRIVATE_KEY ? 
  [process.env.GANACHE_PRIVATE_KEY] : []
```

**Advantages:**
- ✅ Private key not in git
- ✅ Easy to change
- ✅ Same pattern as backend
- ✅ More secure

### **❌ Hardcoded (Old way):**
```typescript
// hardhat.config.ts
accounts: [
  "0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7"
]
```

**Problems:**
- ❌ Exposed in git
- ❌ Hard to change
- ❌ Security risk

---

## 📁 **FILE STRUCTURE**

```
smart-contracts/
├── .env                    ← Your credentials (NOT in git)
├── .env.example            ← Template (safe to commit)
├── .gitignore              ← Contains .env
├── hardhat.config.ts       ← Reads from .env
├── contracts/
│   └── EHRContract.sol
└── scripts/
    └── deploy.ts
```

---

## 🔒 **MAKE SURE .ENV IS IN .GITIGNORE**

Check `smart-contracts/.gitignore`:

```
# dotenv environment variables
.env
.env.local
.env.*.local

# Hardhat files
cache
artifacts
```

**✅ This prevents committing private keys to git!**

---

## 📋 **QUICK REFERENCE**

### **Your Ganache Setup:**
```
Network ID: 5777
RPC URL: http://127.0.0.1:7545
Account (0): 0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9
Private Key: (in .env file)
```

### **Commands:**
```bash
# Setup
cd smart-contracts
cp .env.example .env    # Then edit with your keys
npm install

# Deploy
npm run compile
npm run deploy:ganache

# Result: Contract address → Add to backend .env.dev
```

---

## ✅ **VERIFICATION**

After deployment:

- [ ] Contract address obtained
- [ ] Added to `ehr-backend/.env.dev`
- [ ] Contract visible in Ganache GUI
- [ ] Transaction in Ganache "Transactions" tab
- [ ] Backend can connect (`npm run dev`)

---

## 🎯 **NEXT STEPS**

1. ✅ Create `smart-contracts/.env` with your Ganache credentials
2. ✅ Run `npm run deploy:ganache`
3. ✅ Copy contract address
4. ✅ Add to `ehr-backend/.env.dev`
5. ✅ Test backend connection

**Total time: 5 minutes** ⏱️

---

**MUCH BETTER WITH .ENV!** 🔒✅

