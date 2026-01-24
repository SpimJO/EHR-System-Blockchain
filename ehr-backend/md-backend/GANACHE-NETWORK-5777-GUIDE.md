# 🎯 YOUR GANACHE NETWORK ID: 5777

**Detected:** Your Ganache uses Network ID `5777`  
**Action Required:** Update `.env.dev` file

---

## 📊 **NETWORK ID vs CHAIN ID**

### **What's the difference?**

| Setting | Your Value | Purpose |
|---------|-----------|---------|
| **Network ID** | `5777` | Network identification (older Ganache default) |
| **Chain ID** | `5777` | Transaction signing (use same as Network ID) |
| **RPC URL** | `http://127.0.0.1:7545` | Ganache endpoint |

---

## ✅ **UPDATE YOUR .ENV.DEV**

### **Current (Wrong):**
```env
BLOCKCHAIN_CHAIN_ID=1337  ❌ Wrong for your Ganache!
```

### **Correct (For Your Ganache):**
```env
BLOCKCHAIN_CHAIN_ID=5777  ✅ Matches your Ganache!
```

---

## 🔧 **COMPLETE .ENV.DEV FOR YOUR GANACHE**

Create `ehr-backend/.env.dev` with this content:

```env
# ===================================================================
#  BLOCKCHAIN CONFIGURATION (YOUR GANACHE: Network ID 5777)
# ===================================================================

# SERVER
NODE_ENV=development
PORT=3000
SERVER_HOST=localhost
ALLOWED_HOST=http://localhost:5173

# DATABASE
DATABASE_URL="mysql://root@localhost:3306/ehr_db"

# REDIS (Optional)
REDIS_URL=redis://localhost:6379

# SECURITY KEYS (Your existing keys)
ENC_KEY_SECRET=c5099d7074008d5f9bddd8c0b32feb52dee6188c747628603a7b451d90351795
CIPHER_KEY_SECRET=34ae112d4ae1dc3a80174fde1c7515c53eb027551a178248f4fc3bdbef1a9e65
API_KEY=eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==
API_KEY_SECRET=01f55918785981b25887e765390bbefe3e2285d9270cefc977dd4d01e513fba5

# BLOCKCHAIN - UPDATED FOR YOUR GANACHE (Network ID: 5777)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_NETWORK_NAME=ganache

# UPDATE THESE AFTER SETUP:
EHR_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BLOCKCHAIN_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

GAS_LIMIT=6721975
GAS_PRICE=20000000000

# WALLET ENCRYPTION
ENCRYPTION_KEY=c5099d7074008d5f9bddd8c0b32feb52dee6188c747628603a7b451d90351795

# IPFS (Pinata - Your existing keys)
USE_PINATA=true
PINATA_API_KEY=e926a17a44a338e7fb46
PINATA_SECRET_API_KEY=2e7c28b2f63233ffe4f100d915af674bbb6fa8bb024d17427aed7d42647e5251
PINATA_JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZWQ0ZjZmNS1hM2EyLTRhYTYtYTU5Ni03NDQ2OTQ0ZjJlMDIiLCJlbWFpbCI6InBhbmd0aGVzaXNsYW5nMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlOTI2YTE3YTQ0YTMzOGU3ZmI0NiIsInNjb3BlZEtleVNlY3JldCI6IjJlN2MyOGIyZjYzMjMzZmZlNGYxMDBkOTE1YWY2NzRiYmI2ZmE4YmIwMjRkMTc0MjdhZWQ3ZDQyNjQ3ZTUyNTEiLCJleHAiOjE4MDAwNjQ1NzZ9.M_CAqDKog07foWMyrEwD6Et5cvc-BgA8j4fvUqiUFdY

# Local IPFS (fallback)
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
IPFS_API_URL=http://localhost:5001/api/v0
IPFS_GATEWAY_URL=http://localhost:8081/ipfs/
```

---

## 🔍 **HOW TO VERIFY YOUR GANACHE SETTINGS**

### **Method 1: Check Ganache GUI**

Open Ganache → Look at top of window:

```
NETWORK ID: 5777  ✅ (This is yours!)
RPC SERVER: HTTP://127.0.0.1:7545
```

### **Method 2: Test Connection**

```bash
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"net_version",
    "params":[],
    "id":1
  }'
```

**Expected Response:**
```json
{
  "jsonrpc":"2.0",
  "id":1,
  "result":"5777"  ✅ Your Network ID!
}
```

---

## 📋 **COMPLETE SETUP STEPS**

### **Step 1: Verify Ganache Settings**

**In Ganache GUI, check:**
- ✅ Network ID: `5777`
- ✅ RPC Server: `http://127.0.0.1:7545`
- ✅ Running (green indicator)

### **Step 2: Get Ganache Private Key**

1. In Ganache, find **Account (0)**
2. Click the **🔑 key icon**
3. Copy the **PRIVATE KEY**
4. Save it for Step 4

**Example:**
```
0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

### **Step 3: Update Hardhat Config**

Edit `smart-contracts/hardhat.config.ts`:

```typescript
networks: {
  ganache: {
    url: "http://127.0.0.1:7545",
    chainId: 5777,  // ← Updated to match your Ganache!
    accounts: [
      "0xYOUR_GANACHE_PRIVATE_KEY_HERE"  // From Step 2
    ]
  }
}
```

### **Step 4: Deploy Smart Contract**

```bash
cd smart-contracts

# Install dependencies
npm install

# Compile contract
npm run compile

# Deploy to your Ganache
npm run deploy:ganache
```

**Expected Output:**
```
🚀 Deploying EHR Smart Contract...
📍 Deploying from account: 0x123abc...
💰 Account balance: 100.0 ETH
✅ EHR Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**COPY THE CONTRACT ADDRESS!** ⬆️

### **Step 5: Create .env.dev File**

Create `ehr-backend/.env.dev` (copy template from above)

**Update these two values:**

```env
# 1. Paste contract address from Step 4
EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# 2. Paste private key from Step 2
BLOCKCHAIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

### **Step 6: Setup Database**

```bash
cd ehr-backend

# Generate Prisma client
npm run prisma:generate

# Sync database schema
npm run prisma:db-push
```

### **Step 7: Start Backend**

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3000
⛓️  Connected to blockchain: http://127.0.0.1:7545
📋 Contract address: 0x5FbDB...
💾 Database connected
🗄️  IPFS configured (Pinata)
```

**IF YOU SEE THIS = SUCCESS!** ✅

### **Step 8: Test Registration**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "api-key: eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "PATIENT",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+639123456789"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully with blockchain wallet",
  "statusCode": 201,
  "data": {
    "user": {
      "blockchainAddress": "0xabc123..."  ← REAL ADDRESS!
    }
  }
}
```

**IF YOU GET blockchainAddress = WORKING!** ✅

---

## 🚨 **TROUBLESHOOTING**

### **Problem: "Invalid chainId"**

**Cause:** Chain ID mismatch

**Solution:**
```env
# Make sure both match your Ganache!
BLOCKCHAIN_CHAIN_ID=5777  ✅
```

### **Problem: "Could not connect to blockchain"**

**Cause:** Wrong RPC URL or Ganache not running

**Solution:**
1. Check Ganache is running
2. Verify `BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545`
3. Test connection with curl (see above)

### **Problem: "Transaction failed"**

**Cause:** Wrong network or no gas

**Solution:**
1. Verify Chain ID = 5777
2. Check Account (0) has ETH in Ganache
3. Verify private key is correct

---

## 📊 **DIFFERENT GANACHE VERSIONS**

### **Your Setup:**
```
Network ID: 5777
Chain ID: 5777 (same)
RPC: http://127.0.0.1:7545
```

### **Newer Ganache Default:**
```
Network ID: 1337
Chain ID: 1337
RPC: http://127.0.0.1:7545
```

### **Hardhat Default:**
```
Network ID: 31337
Chain ID: 31337
RPC: http://127.0.0.1:8545
```

**Important:** Always match your config to your actual Ganache settings!

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:

- [ ] Ganache running (Network ID: 5777)
- [ ] `.env.dev` created with CHAIN_ID=5777
- [ ] `hardhat.config.ts` updated with chainId: 5777
- [ ] Smart contract deployed successfully
- [ ] Contract address in `.env.dev`
- [ ] Ganache private key in `.env.dev`
- [ ] Backend starts without errors
- [ ] Test registration returns blockchain address
- [ ] Transaction visible in Ganache

---

## 🎯 **QUICK REFERENCE**

### **Your Ganache Settings:**
```
Network ID: 5777
Chain ID: 5777
RPC URL: http://127.0.0.1:7545
Port: 7545
```

### **Files to Update:**

1. **`ehr-backend/.env.dev`**
   ```env
   BLOCKCHAIN_CHAIN_ID=5777
   ```

2. **`smart-contracts/hardhat.config.ts`**
   ```typescript
   chainId: 5777
   ```

---

## 🚀 **YOU'RE READY WHEN:**

✅ Chain ID matches Ganache (5777)  
✅ Contract deployed successfully  
✅ Backend connects without errors  
✅ Test registration works  
✅ Blockchain address returned  

---

**YOUR NETWORK ID 5777 IS CORRECT!**  
**Just update the config files and you're good to go!** 🎉

**Next:** Follow Step 1-8 above to complete setup!

