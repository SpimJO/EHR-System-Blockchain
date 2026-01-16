# 📋 EHR BLOCKCHAIN - VISUAL SETUP SUMMARY

**Print this for easy reference!**

---

## 🎯 **5-STEP SETUP PROCESS**

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: ONLINE SERVICES                   │
│                         (15 minutes)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📁 PINATA IPFS                    ⛓️ GANACHE               │
│  • https://pinata.cloud            • trufflesuite.com/      │
│  • Sign up (FREE)                    ganache                 │
│  • Get API Keys                    • Install & Open          │
│  • Save keys                       • QUICKSTART ETHEREUM     │
│                                    • Copy Account 0 key      │
│                                                              │
│  ✅ Output: API Keys               ✅ Output: Private Key    │
└─────────────────────────────────────────────────────────────┘

         ↓

┌─────────────────────────────────────────────────────────────┐
│                   STEP 2: SMART CONTRACT                     │
│                         (10 minutes)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  cd smart-contracts                                          │
│  npm install                                                 │
│  npm run compile                                             │
│  npm run deploy:ganache                                      │
│                                                              │
│  ✅ Output: Contract Address (0x...)                         │
└─────────────────────────────────────────────────────────────┘

         ↓

┌─────────────────────────────────────────────────────────────┐
│                    STEP 3: BACKEND CONFIG                    │
│                         (15 minutes)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Create .env.dev with:                                       │
│  • DATABASE_URL                                              │
│  • BLOCKCHAIN_RPC_URL                                        │
│  • EHR_CONTRACT_ADDRESS ← from Step 2                       │
│  • BLOCKCHAIN_PRIVATE_KEY ← from Step 1                     │
│  • ENCRYPTION_KEY (generate)                                 │
│  • IPFS_API_KEY ← from Step 1                               │
│  • IPFS_API_SECRET ← from Step 1                            │
│                                                              │
│  ✅ Output: Configured .env.dev                              │
└─────────────────────────────────────────────────────────────┘

         ↓

┌─────────────────────────────────────────────────────────────┐
│                   STEP 4: DATABASE SETUP                     │
│                          (5 minutes)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  cd ehr-backend                                              │
│  npm run prisma:generate                                     │
│  npm run prisma:db-push                                      │
│                                                              │
│  ✅ Output: Database synced                                  │
└─────────────────────────────────────────────────────────────┘

         ↓

┌─────────────────────────────────────────────────────────────┐
│                     STEP 5: TEST SYSTEM                      │
│                          (5 minutes)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  npm run dev                                                 │
│                                                              │
│  Test registration:                                          │
│  POST /api/auth/register                                     │
│                                                              │
│  ✅ Output: User with blockchainAddress                      │
└─────────────────────────────────────────────────────────────┘

         ↓

    🎉 COMPLETE! (Total: ~50 minutes)
```

---

## 📝 **.env.dev TEMPLATE**

```env
# ===== DATABASE =====
DATABASE_URL=mysql://root:password@localhost:3306/ehr_db

# ===== BLOCKCHAIN =====
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_NETWORK_NAME=ganache

# From smart contract deployment:
EHR_CONTRACT_ADDRESS=0x_____________________________

# From Ganache Account 0:
BLOCKCHAIN_PRIVATE_KEY=0x_____________________________

# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=_____________________________

# ===== IPFS (Pinata) =====
# From pinata.cloud:
IPFS_API_KEY=pinata_api_____________________________
IPFS_API_SECRET=_____________________________

# ===== SERVER =====
PORT=3000
NODE_ENV=development

# ===== GENERATE THESE =====
# npx ts-node src/gen/genSecretToken.ts
ENC_KEY_SECRET=_____________________________
CIPHER_KEY_SECRET=_____________________________

# npx ts-node src/gen/genApiKey.ts
API_KEY=_____________________________

# npx ts-node src/gen/genApiKeySecret.ts
API_KEY_SECRET=_____________________________
```

---

## ✅ **PRE-DEMO CHECKLIST**

Print this and check before thesis defense:

### **Services Running:**
- [ ] Ganache is running (port 7545)
- [ ] MySQL is running (port 3306)
- [ ] Backend server is running (port 3000)
- [ ] No errors in console

### **Configuration:**
- [ ] .env.dev file exists
- [ ] All environment variables filled
- [ ] Contract deployed (has address)
- [ ] Database schema synced

### **Test User Created:**
- [ ] Can register patient
- [ ] Can register doctor
- [ ] Users have blockchain addresses
- [ ] Private keys are encrypted

### **Blockchain Integration:**
- [ ] Backend connects to Ganache
- [ ] Can see contract in Ganache
- [ ] Transactions appear after API calls
- [ ] Events are emitted

### **Full Flow Test:**
- [ ] Patient registers (wallet created)
- [ ] Doctor registers (wallet created)
- [ ] Doctor requests access (blockchain tx)
- [ ] Patient approves (blockchain tx)
- [ ] Doctor can view patient (permission check)
- [ ] Events visible in Ganache

---

## 🔍 **QUICK VERIFICATION COMMANDS**

### **Test Ganache Connection:**
```bash
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```
**Expected:** `{"jsonrpc":"2.0","id":1,"result":"0x1"}`

---

### **Test Backend Running:**
```bash
curl http://localhost:3000/api/health
```
**Expected:** `{"status":"ok"}`

---

### **Test Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@test.com",
    "password": "Test123!",
    "role": "PATIENT",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+639123456789"
  }'
```
**Expected:** Response with `blockchainAddress: "0x..."`

---

### **Test Database:**
```bash
npm run prisma:studio
```
**Expected:** Opens http://localhost:5555 with database UI

---

## 🚨 **EMERGENCY TROUBLESHOOTING**

### **Problem: Cannot connect to blockchain**
```bash
# Fix:
1. Check Ganache is running
2. Verify port 7545 is correct
3. Restart Ganache
```

---

### **Problem: Contract not found**
```bash
# Fix:
cd smart-contracts
npm run deploy:ganache
# Copy new contract address to .env.dev
# Restart backend
```

---

### **Problem: Database error**
```bash
# Fix:
cd ehr-backend
npm run prisma:db-push --force-reset
npm run prisma:generate
npm run dev
```

---

### **Problem: Transaction failed**
```bash
# Fix:
1. Check Ganache Account 0 has ETH
2. Verify BLOCKCHAIN_PRIVATE_KEY is correct
3. Restart Ganache if needed
```

---

## 📊 **DEMO FLOW VISUAL**

```
┌──────────────────────────────────────────────────────────────┐
│                    THESIS DEMO SEQUENCE                       │
└──────────────────────────────────────────────────────────────┘

1. Show Ganache
   └─► "Ito po ang local blockchain with 10 test accounts"

2. Show Backend Terminal
   └─► "Connected sa blockchain at database"

3. Register Patient
   └─► Show auto wallet generation
       └─► Show in Prisma Studio (encrypted key)

4. Register Doctor
   └─► Same process

5. Doctor Requests Access
   └─► Show transaction in Ganache
       └─► Show event emission

6. Patient Sees Request
   └─► Show pending request with reason

7. Patient Approves
   └─► Show transaction in Ganache
       └─► Show AccessGranted event

8. Doctor Views Patient
   └─► Show permission check succeeds
       └─► Show medical records accessible

9. Show Audit Log
   └─► All blockchain events
       └─► Immutable proof with tx hashes

10. Show Revoke (Optional)
    └─► Patient revokes access
        └─► Doctor can no longer access
            └─► Show AccessRevoked event
```

---

## 🎓 **DEFENSE Q&A CHEAT SHEET**

### **Q: Bakit backend-managed ang wallets?**
**A:** "Para user-friendly po. Automatic ang wallet generation during registration. Patients don't need blockchain knowledge. Private keys encrypted sa database."

---

### **Q: San ang sensitive data?**
**A:** "Hybrid po ang architecture:
- Blockchain: Permissions, audit trail (immutable)
- Database: Medical reasons, user profiles (privacy)
- IPFS: Encrypted medical files (decentralized)"

---

### **Q: Magkano ang cost?**
**A:** "FREE po lahat:
- Ganache (local blockchain) - FREE
- Pinata IPFS (1GB) - FREE
- MySQL - FREE
Total: ₱0.00"

---

### **Q: Paano ang security?**
**A:** "Multi-layer po:
1. API Key validation
2. JWT authentication
3. Role-based access
4. Blockchain permission check
5. AES-256-GCM encryption (private keys)
6. File encryption before IPFS"

---

### **Q: Scalable ba?**
**A:** "Yes po. Current:
- Ganache: Unlimited local
- Pinata: 1GB free (upgradeable)
Future: Migrate to Sepolia testnet or mainnet"

---

## 📚 **DOCUMENTATION FILES**

| File | Purpose | When to Read |
|------|---------|--------------|
| **BLOCKCHAIN-SETUP-GUIDE-TAGALOG.md** | Complete setup guide | Start here! |
| **QUICK-START-CHECKLIST.md** | Quick reference | During setup |
| **verify-setup.md** | Verification tests | Before demo |
| **SYSTEM-ARCHITECTURE-OVERVIEW.md** | Architecture docs | For paper |
| **START-HERE-README.md** | Overview | First read |
| **smart-contracts/README.md** | Contract guide | During deployment |

---

## ⏱️ **TIME ESTIMATES**

| Task | Time | Difficulty |
|------|------|-----------|
| Read main guide | 15 min | Easy |
| Setup online services | 15 min | Easy |
| Deploy smart contract | 10 min | Easy |
| Configure backend | 15 min | Easy |
| Setup database | 5 min | Easy |
| Test system | 5 min | Easy |
| Verify everything | 10 min | Easy |
| **TOTAL FIRST TIME** | **~2-3 hours** | **Easy** |
| **TOTAL AFTER PRACTICE** | **~30 minutes** | **Very Easy** |

---

## 🎯 **SUCCESS INDICATORS**

### **✅ Setup Successful If:**
- Ganache shows transactions
- Backend logs show "Connected to blockchain"
- Registration returns blockchain address
- Database has encrypted private keys
- Can complete access request flow
- Events appear in Ganache
- No errors in console

---

## 🚀 **YOU'RE READY WHEN:**

- [x] All services running without errors
- [x] Can register users (auto wallet generation)
- [x] Can complete full access request flow
- [x] Blockchain events visible in Ganache
- [x] Audit trail shows all activities
- [x] Medical records can be uploaded
- [x] Permissions enforced by blockchain

---

**CONGRATULATIONS!** 🎉

**Your EHR Blockchain System is ready for thesis defense!**

Para sa detailed guide, basahin:
# 👉 **BLOCKCHAIN-SETUP-GUIDE-TAGALOG.md**

**Good luck sa defense!** 🎓🚀

