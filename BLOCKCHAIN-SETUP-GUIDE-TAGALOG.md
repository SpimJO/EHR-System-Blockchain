# 🚀 KUMPLETO GUIDE: Blockchain Setup (Walang Docker!)

**Para sa:** EHR Blockchain Thesis Project  
**Target:** FREE tools lang, walang bayad  
**Language:** Tagalog/Filipino

---

## 📋 **BUOD NG KAILANGAN GAWIN**

### **Priority Order:**
1. ✅ Install Ganache (Local Blockchain)
2. ✅ Sign up sa Pinata IPFS (File Storage)
3. ✅ Setup MySQL Database
4. ✅ I-compile at i-deploy ang Smart Contract
5. ✅ I-configure ang Backend
6. ✅ Test ang buong system

**Estimated Time:** 2-3 hours para sa first-time setup

---

## 🎯 **PHASE 1: MGA ONLINE SERVICES (FREE)**

### **1.1 Pinata IPFS Setup** 📁

**Bakit kailangan?**
- Para sa medical files storage (decentralized)
- FREE 1GB storage
- No credit card needed

**Mga Hakbang:**

1. **Pumunta sa:** https://pinata.cloud

2. **Sign Up:**
   - Click "**Get Started**" or "**Sign Up**"
   - Gamitin ang email mo
   - Verify email (check inbox/spam)

3. **Login at kumuha ng API Keys:**
   - After login, go to **"API Keys"** (left sidebar)
   - Click **"+ New Key"**
   - Settings:
     - ✅ Check **"Admin"** (or at least "pinFileToIPFS")
     - Name: **"EHR Backend"**
     - Click **"Create Key"**

4. **IMPORTANTE - I-copy mo agad:**
   ```
   API Key: pinata_api_xxxxxxxxxxxxxxxxxxxxx
   API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   ⚠️ **WARNING:** Hindi mo na makikita ulit ang API Secret pagkatapos mo i-close ang window!

5. **I-save sa notepad muna:**
   ```
   PINATA_API_KEY=pinata_api_xxxxxxxxxxxxxxxxxxxxx
   PINATA_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

**✅ TAPOS NA:** Pinata IPFS Setup Complete!

---

### **1.2 Ganache (Local Blockchain)** ⛓️

**Bakit kailangan?**
- Local Ethereum blockchain para sa development
- FREE, walang gas fees
- 10 test accounts with 100 ETH each (fake ETH)

**Dalawang Options:**

#### **Option A: Ganache GUI (RECOMMENDED para sa thesis demo)**

1. **Download:**
   - Pumunta sa: https://trufflesuite.com/ganache/
   - Click **"Download"**
   - Piliin ang Windows/Mac/Linux version
   - I-install tulad ng normal na app

2. **Open Ganache:**
   - I-launch ang Ganache application
   - Click **"QUICKSTART ETHEREUM"**

3. **Makikita mo:**
   ```
   RPC Server: http://127.0.0.1:7545
   Network ID: 1337
   Gas Price: 20000000000
   Gas Limit: 6721975
   
   Accounts:
   (0) 0x1234... (100 ETH) 🔑
   (1) 0x5678... (100 ETH) 🔑
   (2) 0x9abc... (100 ETH) 🔑
   ... (10 accounts total)
   ```

4. **IMPORTANTE - I-copy ang Private Key ng Account 0:**
   - Click yung **🔑 key icon** sa Account (0)
   - I-copy ang **PRIVATE KEY** (NOT the mnemonic!)
   - Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`
   - I-save sa notepad:
   ```
   GANACHE_ACCOUNT_0_PRIVATE_KEY=0x1234567890abcdef...
   ```

**✅ TAPOS NA:** Ganache running na at may private key ka na!

#### **Option B: Ganache CLI (Command Line)**

```bash
# Install globally
npm install -g ganache

# Run with 10 accounts
ganache --deterministic --accounts 10 --port 7545
```

**Note:** GUI is easier para sa thesis kasi may visual interface.

---

## 🎯 **PHASE 2: DATABASE SETUP**

### **2.1 MySQL Setup**

**Kung wala ka pang MySQL:**

1. **Download MySQL:**
   - https://dev.mysql.com/downloads/installer/
   - Piliin "MySQL Installer for Windows"
   - Download at i-install

2. **During Installation:**
   - Root password: **"password"** (o kahit ano, basta tandaan mo!)
   - Port: **3306** (default)

3. **Create Database:**
   ```sql
   CREATE DATABASE ehr_db;
   ```

   Or gamit ang MySQL Workbench:
   - Open MySQL Workbench
   - Connect sa localhost
   - Right-click → Create Schema
   - Name: **ehr_db**
   - Click "Apply"

**Database URL:**
```
mysql://root:password@localhost:3306/ehr_db
```
(Replace "password" kung iba ang ginawa mong password)

**✅ TAPOS NA:** Database ready na!

---

## 🎯 **PHASE 3: SMART CONTRACT DEPLOYMENT**

### **3.1 Install Dependencies**

```bash
# Pumunta sa smart-contracts folder
cd D:\CAPSTONE\ehr-blockchain\smart-contracts

# Install Hardhat at dependencies
npm install
```

### **3.2 Configure Hardhat**

1. **Open file:** `smart-contracts/hardhat.config.ts`

2. **I-paste ang private key from Ganache:**

```typescript
networks: {
  ganache: {
    url: "http://127.0.0.1:7545",
    chainId: 1337,
    accounts: [
      // I-paste dito yung private key from Ganache Account 0
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    ]
  },
}
```

3. **Save** ang file

### **3.3 Compile Contract**

```bash
npm run compile
```

**Expected output:**
```
Compiled 1 Solidity file successfully
✓ Compilation complete
```

### **3.4 Deploy to Ganache**

**IMPORTANTE:** Make sure Ganache is running!

```bash
npm run deploy:ganache
```

**Expected output:**
```
🚀 Deploying EHR Smart Contract...

📍 Deploying from account: 0x1234...
💰 Account balance: 100.0 ETH

📦 Deploying EHRContract...

✅ EHR Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️  Next Steps:
1. Copy the contract address above
2. Add to ehr-backend/.env.dev:
   EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**✅ IMPORTANTE:** I-copy ang **Contract Address** - kailangan mo ito sa backend!

**✅ TAPOS NA:** Smart contract deployed na sa Ganache!

---

## 🎯 **PHASE 4: BACKEND CONFIGURATION**

### **4.1 Create/Update .env.dev file**

```bash
cd D:\CAPSTONE\ehr-blockchain\ehr-backend
```

**Create/Edit `.env.dev` file:**

```env
# ================================
# DATABASE
# ================================
DATABASE_URL=mysql://root:password@localhost:3306/ehr_db

# ================================
# BLOCKCHAIN CONFIGURATION
# ================================
# Ganache RPC URL
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_NETWORK_NAME=ganache

# Contract Address (from deployment)
EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Backend Service Account Private Key (Ganache Account 0)
BLOCKCHAIN_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# ================================
# WALLET ENCRYPTION
# ================================
# 32-byte hex key for encrypting user private keys
# Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

# ================================
# IPFS CONFIGURATION (Pinata)
# ================================
IPFS_API_KEY=pinata_api_xxxxxxxxxxxxxxxxxxxxx
IPFS_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ================================
# SERVER CONFIG
# ================================
PORT=3000
NODE_ENV=development

# ================================
# JWT SECRETS (Generate using genSecretToken.ts)
# ================================
ENC_KEY_SECRET=your_enc_key_here
CIPHER_KEY_SECRET=your_cipher_key_here

# ================================
# API KEY (Generate using genApiKey.ts)
# ================================
API_KEY=your_api_key_here
API_KEY_SECRET=your_api_key_secret_here
```

### **4.2 Generate Security Keys**

```bash
cd D:\CAPSTONE\ehr-blockchain\ehr-backend

# Generate encryption key for wallets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
# Copy to ENCRYPTION_KEY

# Generate JWT secrets
npx ts-node src/gen/genSecretToken.ts
# Copy output to ENC_KEY_SECRET and CIPHER_KEY_SECRET

# Generate API Key
npx ts-node src/gen/genApiKey.ts
# Copy output to API_KEY

# Generate API Key Secret
npx ts-node src/gen/genApiKeySecret.ts
# Copy output to API_KEY_SECRET
```

### **4.3 Setup Database Schema**

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:db-push

# Open Prisma Studio to verify (optional)
npm run prisma:studio
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

**✅ TAPOS NA:** Backend configured at database synced na!

---

## 🎯 **PHASE 5: START BACKEND SERVER**

```bash
cd D:\CAPSTONE\ehr-blockchain\ehr-backend
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:3000
⛓️  Connected to blockchain: http://127.0.0.1:7545
📋 Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
💾 Database connected
🗄️  IPFS configured
```

**✅ TAPOS NA:** Backend running na!

---

## 🎯 **PHASE 6: TEST ANG SYSTEM**

### **6.1 Test Registration (Creates Blockchain Wallet)**

**Using Postman or cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d '{
    "fullName": "Dr. Juan dela Cruz",
    "email": "doctor@test.com",
    "password": "SecurePass123!",
    "role": "DOCTOR",
    "gender": "MALE",
    "dateOfBirth": "1985-05-15",
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
      "id": "uuid",
      "email": "doctor@test.com",
      "fullName": "Dr. Juan dela Cruz",
      "role": "DOCTOR",
      "blockchainAddress": "0xabcdef1234567890..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ SUCCESS!** Kung makakuha ka ng blockchain address, working na!

### **6.2 Verify sa Prisma Studio**

```bash
npm run prisma:studio
```

Check sa **User** table:
- ✅ `blockchainAddress` - should be populated (0x...)
- ✅ `privateKeyHash` - should have encrypted data (iv:authTag:encrypted)

### **6.3 Verify sa Ganache**

Open Ganache GUI:
- Go to **"Transactions"** tab
- Dapat may bagong transaction (contract deployment)
- Go to **"Contracts"** tab
- Dapat makita mo ang EHRContract address

**✅ TAPOS NA ANG LAHAT!** 🎉

---

## 📚 **COMPLETE CHECKLIST**

Bago ka mag-demo sa thesis defense, check mo ito:

### **Online Services:**
- [ ] Pinata account created
- [ ] Pinata API keys obtained
- [ ] Ganache installed and running

### **Smart Contract:**
- [ ] Contract compiled successfully
- [ ] Contract deployed to Ganache
- [ ] Contract address saved

### **Backend:**
- [ ] .env.dev configured completely
- [ ] All secrets generated
- [ ] Database schema pushed
- [ ] Server starts without errors

### **Testing:**
- [ ] Can register patient
- [ ] Can register doctor
- [ ] Can register staff
- [ ] Each user gets blockchain address
- [ ] Database shows encrypted private keys

### **Blockchain Integration:**
- [ ] Backend connects to Ganache
- [ ] Contract loads successfully
- [ ] Transactions appear in Ganache

---

## 🐛 **TROUBLESHOOTING**

### **Problem: "Cannot connect to blockchain"**

**Solution:**
```bash
# 1. Check if Ganache is running
# Open Ganache GUI and make sure it's on "QUICKSTART"

# 2. Verify RPC URL in .env.dev
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545

# 3. Test connection manually
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### **Problem: "Contract not deployed"**

**Solution:**
```bash
cd smart-contracts
npm run deploy:ganache

# Copy ang contract address
# Update sa .env.dev
# Restart backend server
```

### **Problem: "Prisma migration failed"**

**Solution:**
```bash
# 1. Make sure MySQL is running
# 2. Check DATABASE_URL in .env.dev
# 3. Try:
npm run prisma:db-push --force-reset
npm run prisma:generate
```

### **Problem: "IPFS upload failed"**

**Solution:**
```bash
# 1. Verify Pinata API keys
# 2. Test sa Pinata dashboard
# 3. Check free tier limits (1GB)
```

### **Problem: "Transaction failed: insufficient funds"**

**Solution:**
```bash
# 1. Check Ganache - Account 0 should have ETH
# 2. Verify BLOCKCHAIN_PRIVATE_KEY matches Account 0
# 3. Restart Ganache if needed
```

---

## 🔗 **IMPORTANT LINKS**

### **Free Services:**
- **Ganache:** https://trufflesuite.com/ganache/
- **Pinata IPFS:** https://pinata.cloud
- **MySQL:** https://dev.mysql.com/downloads/

### **Documentation:**
- **Hardhat:** https://hardhat.org/
- **Ethers.js:** https://docs.ethers.org/
- **Prisma:** https://www.prisma.io/docs

### **Testnet (Optional - kung gusto mo public):**
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **Infura RPC:** https://infura.io/
- **Alchemy RPC:** https://alchemy.com/

---

## 🎓 **PARA SA THESIS DEFENSE**

### **Demo Flow Suggestion:**

1. **Show Ganache:**
   - "Ito po ang local blockchain natin with 10 test accounts"
   - Show transactions tab

2. **Show Backend Running:**
   - "Nakikita po natin na connected sa blockchain"
   - Show terminal logs

3. **Register Patient:**
   - "Mag-register tayo ng patient"
   - Show blockchain address generation
   - Show sa Prisma Studio ang encrypted private key

4. **Register Doctor:**
   - Same process

5. **Doctor Requests Access:**
   - Show transaction in Ganache
   - Show event emission

6. **Patient Approves:**
   - Show transaction
   - Show AccessGranted event

7. **Show Audit Log:**
   - All events from blockchain
   - Immutable proof

8. **Upload Medical Record:**
   - Show IPFS upload sa Pinata
   - Show blockchain transaction
   - Show verification

### **Panelist Questions - Prepared Answers:**

**Q: "Bakit hindi ninyo ginamit ang MetaMask?"**
A: "Para po mas user-friendly, backend-generated ang wallets. Automatic ang wallet creation during registration. This makes it easier for non-technical users like patients."

**Q: "San niyo naka-store ang private keys?"**
A: "Encrypted po sa database using AES-256-GCM encryption. Hindi po directly accessible sa frontend para sa security."

**Q: "Bakit may off-chain storage pa?"**
A: "Hybrid architecture po para sa privacy and efficiency. Sensitive data like medical reasons ay hindi dapat public sa blockchain. Blockchain lang po ang permissions and audit trail."

**Q: "Magkano ang cost?"**
A: "FREE po lahat:
- Ganache (local blockchain) - FREE
- Pinata IPFS (1GB free tier) - FREE  
- MySQL - FREE
- Total: 0 pesos"

---

## ✅ **FINAL NOTES**

**Congratulations!** Kung natapos mo lahat ng steps, ready ka na for:
1. ✅ Thesis demo
2. ✅ System testing
3. ✅ Frontend integration
4. ✅ Complete access control flow testing

**Next:** Connect ang frontend para sa full end-to-end demo!

**Good luck sa defense! 🎓🚀**

---

**Questions?** Review lang ulit ang guide or check troubleshooting section.

