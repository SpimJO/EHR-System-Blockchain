# 🔍 SYSTEM VERIFICATION GUIDE

Gamitin itong guide para i-verify na tama ang setup mo bago mag-demo.

---

## ✅ **CHECKLIST 1: Services Running**

### Ganache Blockchain
```bash
# Check if Ganache is running
curl -X POST http://127.0.0.1:7545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Expected:** JSON response with block number
```json
{"jsonrpc":"2.0","id":1,"result":"0x0"}
```

**If error:**
- Open Ganache GUI
- Click "QUICKSTART ETHEREUM"
- Make sure it says "RUNNING" sa top

---

### MySQL Database
```bash
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES LIKE 'ehr_db';"
```

**Expected:** Shows `ehr_db` database

**If error:**
- Start MySQL service
- Create database: `CREATE DATABASE ehr_db;`

---

### Backend Server
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

**If errors:**
- Check .env.dev file exists
- Check all environment variables are set
- Check Ganache is running
- Check MySQL is running

---

## ✅ **CHECKLIST 2: Configuration Files**

### .env.dev File
```bash
cd ehr-backend
cat .env.dev  # (Windows: type .env.dev)
```

**Must have these variables:**
```
DATABASE_URL=mysql://...
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
EHR_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
ENCRYPTION_KEY=...
IPFS_API_KEY=...
IPFS_API_SECRET=...
API_KEY=...
API_KEY_SECRET=...
ENC_KEY_SECRET=...
CIPHER_KEY_SECRET=...
```

**Missing any?** Follow BLOCKCHAIN-SETUP-GUIDE-TAGALOG.md

---

### Smart Contract Deployment
```bash
cd smart-contracts
npm run compile
```

**Expected:**
```
Compiled 1 Solidity file successfully
```

**Then check:**
```bash
# artifacts folder should exist
ls artifacts/contracts/EHRContract.sol/
```

**Should see:** `EHRContract.json` file

---

## ✅ **CHECKLIST 3: Database Schema**

### Verify Prisma Setup
```bash
cd ehr-backend
npm run prisma:studio
```

**Expected:** Opens browser at http://localhost:5555

**Check these tables exist:**
- User
- PatientProfile
- DoctorProfile
- StaffProfile
- MedicalRecord
- AccessRequest

**Missing tables?**
```bash
npm run prisma:generate
npm run prisma:db-push
```

---

## ✅ **CHECKLIST 4: Blockchain Integration**

### Test Contract Connection
**Create test file:** `ehr-backend/test-blockchain.js`

```javascript
const { ethers } = require('ethers');

async function testBlockchain() {
  try {
    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
    
    // Get block number
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ Connected to blockchain');
    console.log('📦 Current block:', blockNumber);
    
    // Check contract
    const contractAddress = process.env.EHR_CONTRACT_ADDRESS;
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      console.log('❌ Contract not deployed');
    } else {
      console.log('✅ Contract deployed at:', contractAddress);
      console.log('📄 Contract code length:', code.length, 'bytes');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBlockchain();
```

**Run:**
```bash
node test-blockchain.js
```

**Expected:**
```
✅ Connected to blockchain
📦 Current block: 1
✅ Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📄 Contract code length: 12345 bytes
```

---

## ✅ **CHECKLIST 5: API Endpoints**

### Test Registration (Creates Blockchain Wallet)

**Save as:** `test-api.http` (or use Postman)

```http
### Register Patient
POST http://localhost:3000/api/auth/register
Content-Type: application/json
api-key: YOUR_API_KEY

{
  "fullName": "Test Patient",
  "email": "patient@test.com",
  "password": "Test123!",
  "role": "PATIENT",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+639123456789"
}

### Register Doctor
POST http://localhost:3000/api/auth/register
Content-Type: application/json
api-key: YOUR_API_KEY

{
  "fullName": "Test Doctor",
  "email": "doctor@test.com",
  "password": "Test123!",
  "role": "DOCTOR",
  "gender": "FEMALE",
  "dateOfBirth": "1985-01-01",
  "phoneNumber": "+639987654321"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully with blockchain wallet",
  "statusCode": 201,
  "data": {
    "user": {
      "id": "uuid",
      "email": "patient@test.com",
      "blockchainAddress": "0xabcdef1234567890..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ KEY INDICATOR:** Must have `blockchainAddress` in response!

---

### Verify in Database

```bash
npm run prisma:studio
```

**Check User table:**
1. Find the test users
2. Verify fields:
   - ✅ `blockchainAddress` - should be 0x...
   - ✅ `privateKeyHash` - should have format: `iv:authTag:encrypted`
   - ✅ `role` - PATIENT or DOCTOR

**Example privateKeyHash:**
```
a1b2c3d4e5f6:789012345678:9abc1def2345...
```

---

### Verify in Ganache

**Open Ganache GUI:**
1. Go to **"Accounts"** tab
2. Should see Account 0 with slightly less than 100 ETH (used for deployment)
3. Go to **"Blocks"** tab
4. Should see block(s) with transactions
5. Go to **"Transactions"** tab
6. Should see contract creation transaction

---

## ✅ **CHECKLIST 6: IPFS Integration**

### Test Pinata Connection

**Create:** `test-ipfs.js`

```javascript
const axios = require('axios');
const FormData = require('form-data');

async function testPinata() {
  const url = 'https://api.pinata.cloud/data/testAuthentication';
  
  try {
    const response = await axios.get(url, {
      headers: {
        pinata_api_key: process.env.IPFS_API_KEY,
        pinata_secret_api_key: process.env.IPFS_API_SECRET
      }
    });
    
    console.log('✅ Pinata authenticated!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Pinata authentication failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

testPinata();
```

**Run:**
```bash
node test-ipfs.js
```

**Expected:**
```
✅ Pinata authenticated!
Response: { message: 'Congratulations! You are communicating with the Pinata API!' }
```

---

## ✅ **CHECKLIST 7: End-to-End Flow**

### Complete Access Request Flow

**1. Register Patient:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Juan Patient","email":"juan@test.com","password":"Test123!","role":"PATIENT","gender":"MALE","dateOfBirth":"1990-01-01","phoneNumber":"+639111111111"}'
```

**Save:** Patient's `token` and `blockchainAddress`

**2. Register Doctor:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Dr. Maria","email":"maria@test.com","password":"Test123!","role":"DOCTOR","gender":"FEMALE","dateOfBirth":"1985-01-01","phoneNumber":"+639222222222"}'
```

**Save:** Doctor's `token` and `blockchainAddress`

**3. Doctor Requests Access:**
```bash
curl -X POST http://localhost:3000/api/access-requests/request \
  -H "api-key: YOUR_API_KEY" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_USER_ID","reason":"Need to review medical history"}'
```

**Expected:** Transaction hash returned

**4. Patient Views Requests:**
```bash
curl -X GET http://localhost:3000/api/access-requests/my \
  -H "api-key: YOUR_API_KEY" \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

**Expected:** Shows pending request from doctor

**5. Patient Approves:**
```bash
curl -X POST http://localhost:3000/api/access-requests/DOCTOR_ADDRESS/approve \
  -H "api-key: YOUR_API_KEY" \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

**Expected:** Transaction hash + access granted

**6. Verify in Ganache:**
- Should see 2-3 new transactions
- Should see events: AccessRequested, AccessGranted

**7. Doctor Views Authorized Patients:**
```bash
curl -X GET http://localhost:3000/api/patients/my \
  -H "api-key: YOUR_API_KEY" \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

**Expected:** Shows patient in list

---

## ✅ **FINAL VERIFICATION**

### System is ready if:

- [x] Ganache shows transactions
- [x] Database has users with blockchain addresses
- [x] Users have encrypted private keys
- [x] Backend connects to blockchain
- [x] Backend connects to IPFS
- [x] API endpoints work
- [x] Can complete access request flow
- [x] Events appear in Ganache
- [x] Audit trail is visible

### Ready for:

- ✅ Thesis Demo
- ✅ Defense Presentation
- ✅ Frontend Integration
- ✅ Complete System Testing

---

## 🚨 **If Something Fails:**

1. **Check Services:** Ganache, MySQL, Backend all running?
2. **Check Config:** All environment variables set?
3. **Check Logs:** What error message?
4. **Restart Everything:**
   ```bash
   # Restart Ganache
   # Restart MySQL
   # Restart Backend
   npm run dev
   ```
5. **Re-deploy if needed:**
   ```bash
   cd smart-contracts
   npm run deploy:ganache
   # Update contract address in .env.dev
   ```

---

**System verification complete!** 🎉

If all checks pass, you're ready for demo! 🚀

