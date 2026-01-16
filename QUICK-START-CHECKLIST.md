# ⚡ QUICK START CHECKLIST - EHR Blockchain Setup

## 📋 STEP-BY-STEP (Copy-Paste Ready!)

### **STEP 1: Online Services (15 min)**

#### Pinata IPFS:
1. Go to: https://pinata.cloud
2. Sign up (FREE)
3. Get API Keys → Copy to notepad

#### Ganache:
1. Download: https://trufflesuite.com/ganache/
2. Install & Open
3. Click "QUICKSTART ETHEREUM"
4. Copy Account 0 Private Key (🔑 icon)

---

### **STEP 2: Database (5 min)**

```bash
# Create MySQL database
CREATE DATABASE ehr_db;

# Database URL:
mysql://root:password@localhost:3306/ehr_db
```

---

### **STEP 3: Smart Contract (10 min)**

```bash
cd D:\CAPSTONE\ehr-blockchain\smart-contracts

# Install dependencies
npm install

# Edit hardhat.config.ts - paste Ganache Account 0 private key

# Compile
npm run compile

# Deploy to Ganache (make sure Ganache is running!)
npm run deploy:ganache

# COPY THE CONTRACT ADDRESS! ⬆️
```

---

### **STEP 4: Backend Config (10 min)**

```bash
cd D:\CAPSTONE\ehr-blockchain\ehr-backend

# Generate keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npx ts-node src/gen/genSecretToken.ts
npx ts-node src/gen/genApiKey.ts
npx ts-node src/gen/genApiKeySecret.ts
```

**Create `.env.dev`** (see template below)

---

### **STEP 5: Database Setup (5 min)**

```bash
cd D:\CAPSTONE\ehr-blockchain\ehr-backend

npm run prisma:generate
npm run prisma:db-push
npm run prisma:studio  # Verify
```

---

### **STEP 6: Start Server (2 min)**

```bash
npm run dev
```

**Should see:**
```
🚀 Server running on http://localhost:3000
⛓️  Connected to blockchain
```

---

### **STEP 7: Test (5 min)**

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{
    "fullName": "Test Doctor",
    "email": "doctor@test.com",
    "password": "Test123!",
    "role": "DOCTOR",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+639123456789"
  }'
```

**Expected:** Should return blockchain address!

---

## 📄 **.env.dev TEMPLATE**

```env
# DATABASE
DATABASE_URL=mysql://root:password@localhost:3306/ehr_db

# BLOCKCHAIN (Update these!)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
EHR_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
BLOCKCHAIN_PRIVATE_KEY=0xYOUR_GANACHE_ACCOUNT_0_PRIVATE_KEY

# WALLET ENCRYPTION (Generate this!)
ENCRYPTION_KEY=YOUR_32_BYTE_HEX_KEY

# IPFS - PINATA (From pinata.cloud)
IPFS_API_KEY=pinata_api_xxxxx
IPFS_API_SECRET=xxxxx

# SERVER
PORT=3000
NODE_ENV=development

# JWT SECRETS (Generate using genSecretToken.ts)
ENC_KEY_SECRET=xxxxx
CIPHER_KEY_SECRET=xxxxx

# API KEY (Generate using genApiKey.ts)
API_KEY=xxxxx
API_KEY_SECRET=xxxxx
```

---

## ✅ VERIFICATION CHECKLIST

Before thesis demo, verify:

### Services Running:
- [ ] Ganache is running (GUI or CLI)
- [ ] MySQL is running
- [ ] Backend server is running (no errors)

### Config Files:
- [ ] `.env.dev` exists with all values
- [ ] Smart contract deployed (has address)
- [ ] Pinata API keys valid

### Database:
- [ ] `ehr_db` database exists
- [ ] Prisma schema synced
- [ ] Can open Prisma Studio

### Blockchain:
- [ ] Backend connects to Ganache
- [ ] Contract loads successfully
- [ ] Can see contract in Ganache GUI

### API Tests:
- [ ] Can register patient
- [ ] Can register doctor  
- [ ] Users get blockchain addresses
- [ ] Addresses visible in Prisma Studio

---

## 🚨 COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| "Cannot connect to blockchain" | Make sure Ganache is running on port 7545 |
| "Contract not found" | Re-deploy contract, update EHR_CONTRACT_ADDRESS |
| "Prisma error" | Run `npm run prisma:db-push` |
| "IPFS upload failed" | Check Pinata API keys |
| "Transaction failed" | Check Ganache Account 0 has ETH |

---

## 📞 NEED HELP?

1. Check **BLOCKCHAIN-SETUP-GUIDE-TAGALOG.md** (detailed guide)
2. Check **smart-contracts/README.md** (contract-specific)
3. Check Ganache transactions tab for errors
4. Check backend console logs

---

## 🎯 TOTAL TIME: ~50 minutes

**System Ready for:**
- ✅ Thesis Demo
- ✅ End-to-end Testing
- ✅ Frontend Integration
- ✅ Defense Presentation

Good luck! 🚀

