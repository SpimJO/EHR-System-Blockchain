# 🏗️ EHR BLOCKCHAIN SYSTEM - COMPLETE ARCHITECTURE

**Project:** Electronic Health Records on Blockchain  
**Type:** Capstone/Thesis Project  
**Architecture:** Hybrid On-Chain/Off-Chain  
**Cost:** FREE (Zero pesos!)

---

## 📊 **HIGH-LEVEL ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  - Patient Dashboard    - Doctor Dashboard    - Staff Dashboard │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │ JWT Authentication
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Controllers  │  │  Middleware  │  │   Blockchain Lib   │   │
│  │ - Auth       │  │  - API Key   │  │   - Wallet Gen     │   │
│  │ - Records    │  │  - JWT Auth  │  │   - Encryption     │   │
│  │ - Access Req │  │  - Role Guard│  │   - Contract Calls │   │
│  └──────┬───────┘  └──────────────┘  └─────────┬──────────┘   │
│         │                                        │               │
└─────────┼────────────────────────────────────────┼──────────────┘
          │                                        │
          │                                        │
    ┌─────▼─────┐                          ┌──────▼──────┐
    │  DATABASE │                          │  BLOCKCHAIN │
    │  (MySQL)  │                          │  (Ganache)  │
    │           │                          │             │
    │ - Users   │                          │ - Contract  │
    │ - Profiles│                          │ - Events    │
    │ - Records │                          │ - Perms     │
    └───────────┘                          └─────────────┘
          │
          │
    ┌─────▼─────┐
    │   IPFS    │
    │ (Pinata)  │
    │           │
    │ - Medical │
    │   Files   │
    │ (Encrypted)│
    └───────────┘
```

---

## 🔄 **DATA FLOW ARCHITECTURE**

### **Hybrid Storage Model:**

| Data Type | Storage Location | Reason |
|-----------|-----------------|--------|
| **Access Permissions** | ⛓️ BLOCKCHAIN | Security, Immutability, Proof |
| **Audit Events** | ⛓️ BLOCKCHAIN | Compliance, Tamper-proof |
| **Record Metadata** | 💾 DATABASE | Query Performance, Privacy |
| **User Profiles** | 💾 DATABASE | PII, Frequent Updates |
| **Access Request Reason** | 💾 DATABASE | Privacy, Long Text |
| **Blockchain Addresses** | 💾 DATABASE | User Mapping |
| **Private Keys** | 💾 DATABASE (Encrypted) | Backend Signing |
| **Medical Files** | 🗄️ IPFS | Large Files, Decentralized |

---

## 🔐 **SECURITY ARCHITECTURE**

### **Multi-Layer Security:**

```
┌──────────────────────────────────────────────────────┐
│                   REQUEST LAYER                       │
│  1. API Key Validation (Encrypted Header)            │
│  2. Rate Limiting (Redis)                             │
│  3. CORS Protection                                   │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────┐
│               AUTHENTICATION LAYER                    │
│  1. JWT Token Validation                              │
│  2. User Session Verification                         │
│  3. Triple-Layer Encryption (CipherToken)             │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────┐
│              AUTHORIZATION LAYER                      │
│  1. Role-Based Access Control (RBAC)                  │
│  2. Blockchain Permission Check                       │
│  3. Resource Ownership Verification                   │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────┐
│                  DATA LAYER                           │
│  1. Private Key Encryption (AES-256-GCM)              │
│  2. Medical File Encryption (Before IPFS)             │
│  3. Database Encryption at Rest                       │
└───────────────────────────────────────────────────────┘
```

---

## 🔑 **WALLET MANAGEMENT ARCHITECTURE**

### **Backend-Generated Wallets (No MetaMask)**

```
┌─────────────────────────────────────────────────────┐
│               USER REGISTRATION                      │
│  User submits: { email, password, name, role }      │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│           WALLET GENERATION                          │
│  1. Generate random Ethereum wallet (ethers.js)     │
│     - Public Address: 0x1234...                      │
│     - Private Key: 0xabcd...                         │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│          PRIVATE KEY ENCRYPTION                      │
│  Algorithm: AES-256-GCM                              │
│  Format: iv:authTag:encryptedData                    │
│  Key Source: ENCRYPTION_KEY env variable             │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│            DATABASE STORAGE                          │
│  User Table:                                         │
│  - blockchainAddress: 0x1234... (public)            │
│  - privateKeyHash: iv:tag:encrypted (encrypted)     │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│         BLOCKCHAIN OPERATIONS                        │
│  When needed for transactions:                       │
│  1. Fetch encrypted private key from DB              │
│  2. Decrypt using ENCRYPTION_KEY                     │
│  3. Create wallet instance                           │
│  4. Sign transaction                                 │
│  5. Send to blockchain                               │
│  6. Never expose private key to frontend             │
└──────────────────────────────────────────────────────┘
```

---

## 📋 **COMPLETE FEATURE FLOW**

### **1. Patient Uploads Medical Record**

```
PATIENT → Backend → IPFS (Pinata) → Blockchain → Audit Log

Step-by-Step:
1. Patient uploads file (PDF/Image)
2. Backend encrypts file (AES-256)
3. Upload to IPFS → Get hash (Qm...)
4. Create MedicalRecord in Database
5. Patient's wallet signs transaction
6. Smart contract: uploadRecord(recordId, ipfsHash)
7. Blockchain emits: RecordUploaded event
8. Event appears in audit log
```

---

### **2. Doctor Requests Access to Patient Records**

```
DOCTOR → Backend → Database + Blockchain → PATIENT

Step-by-Step:
1. Doctor searches for patient (by email)
2. Doctor enters reason: "Need for surgery prep"
3. Backend creates AccessRequest in Database
   - patientId, requesterId, reason, status: PENDING
4. Doctor's wallet signs transaction
5. Smart contract: requestAccess(patientAddress)
6. Blockchain emits: AccessRequested event
7. Patient sees request in dashboard
   - Shows: Doctor name, reason, timestamp
```

---

### **3. Patient Approves Access Request**

```
PATIENT → Backend → Blockchain → DOCTOR gets access

Step-by-Step:
1. Patient views pending requests
2. Patient clicks "Approve" on doctor's request
3. Patient's wallet signs transaction
4. Smart contract: approveAccess(doctorAddress)
5. Contract updates: authorizedUsers[patientAddress].push(doctorAddress)
6. Blockchain emits: AccessGranted event
7. Database updates: AccessRequest status = APPROVED
8. Doctor can now view patient records
```

---

### **4. Doctor Views Patient Records**

```
DOCTOR → Backend → Blockchain (Permission Check) → Database + IPFS → DOCTOR

Step-by-Step:
1. Doctor navigates to patient's records
2. Backend checks blockchain: 
   - getAuthorizedUsers(patientAddress)
   - Verify doctorAddress is in list
3. If NOT authorized: Return 403 Forbidden
4. If authorized:
   - Query database for record metadata
   - Query blockchain for IPFS hashes
   - Return list of records with download links
5. Doctor clicks "Download"
6. Backend fetches encrypted file from IPFS
7. Backend decrypts file
8. Streams file to doctor
```

---

### **5. Patient Revokes Access**

```
PATIENT → Backend → Blockchain → DOCTOR loses access

Step-by-Step:
1. Patient views authorized users
2. Patient clicks "Revoke" on doctor
3. Confirmation dialog appears
4. Patient confirms revocation
5. Patient's wallet signs transaction
6. Smart contract: revokeAccess(doctorAddress)
7. Contract removes doctor from authorizedUsers
8. Blockchain emits: AccessRevoked event
9. Immediate effect: Doctor can no longer access records
10. Event appears in audit log (immutable proof)
```

---

## 🗂️ **DATABASE SCHEMA**

### **Core Models:**

```sql
-- User Table
User {
  id                UUID PRIMARY KEY
  email             STRING UNIQUE
  password          STRING (hashed)
  fullName          STRING
  role              ENUM (PATIENT, DOCTOR, STAFF)
  blockchainAddress STRING UNIQUE  ← Ethereum address
  privateKeyHash    STRING         ← Encrypted private key
  createdAt         DATETIME
}

-- Doctor Profile
DoctorProfile {
  id                UUID PRIMARY KEY
  userId            UUID FOREIGN KEY → User
  designation       STRING
  specialization    STRING
  licenseNumber     STRING UNIQUE
  medicalId         STRING UNIQUE
  phoneNumber       STRING
  department        STRING
  hospitalName      STRING
}

-- Patient Profile
PatientProfile {
  id                UUID PRIMARY KEY
  userId            UUID FOREIGN KEY → User
  bloodType         STRING
  allergies         TEXT
  emergencyContact  STRING
  emergencyPhone    STRING
}

-- Medical Record
MedicalRecord {
  id                UUID PRIMARY KEY
  patientId         UUID FOREIGN KEY → User
  recordType        STRING
  title             STRING
  description       TEXT
  ipfsHash          STRING         ← Link to IPFS file
  fileSize          INTEGER
  recordDate        DATE
  uploadedAt        DATETIME
  transactionHash   STRING         ← Blockchain proof
}

-- Access Request
AccessRequest {
  id                UUID PRIMARY KEY
  patientId         UUID FOREIGN KEY → User
  requesterId       UUID FOREIGN KEY → User
  reason            TEXT             ← Medical justification
  status            ENUM (PENDING, APPROVED, DENIED)
  transactionHash   STRING
  requestedAt       DATETIME
  respondedAt       DATETIME
}
```

---

## 📜 **SMART CONTRACT STRUCTURE**

### **EHRContract.sol:**

```solidity
contract EHRContract {
  // State
  mapping(address => MedicalRecord[]) public patientRecords;
  mapping(address => address[]) public authorizedUsers;
  mapping(address => AccessRequest[]) public accessRequests;
  
  // Events
  event RecordUploaded(address patient, string ipfsHash, uint timestamp);
  event AccessRequested(address patient, address requester, uint timestamp);
  event AccessGranted(address patient, address authorized, uint timestamp);
  event AccessRevoked(address patient, address revoked, uint timestamp);
  
  // Functions
  function uploadRecord(string recordId, string ipfsHash) external;
  function requestAccess(address patient) external;
  function approveAccess(address requester) external;
  function revokeAccess(address user) external;
  
  // View Functions
  function getPatientRecordCount(address patient) view returns (uint);
  function getAuthorizedUsers(address patient) view returns (address[]);
  function getPendingAccessRequests(address patient) view returns (...);
}
```

---

## 🌐 **NETWORK ARCHITECTURE**

### **Development Setup (FREE):**

```
┌──────────────────────────────────────────────┐
│         LOCAL DEVELOPMENT STACK              │
├──────────────────────────────────────────────┤
│                                              │
│  🖥️  Ganache (Local Blockchain)              │
│      - RPC: http://127.0.0.1:7545           │
│      - Chain ID: 1337                        │
│      - 10 accounts × 100 ETH each            │
│      - Instant mining                        │
│      - Zero gas fees                         │
│                                              │
│  🗄️  MySQL Database                          │
│      - Host: localhost:3306                  │
│      - Database: ehr_db                      │
│                                              │
│  ☁️  Pinata IPFS                             │
│      - Free tier: 1GB storage                │
│      - API: https://api.pinata.cloud         │
│                                              │
│  🚀 Backend Server                           │
│      - http://localhost:3000                 │
│      - Node.js + Express                     │
│                                              │
└──────────────────────────────────────────────┘

Total Cost: ₱0 (FREE!)
```

### **Production/Testnet Setup (Optional):**

```
┌──────────────────────────────────────────────┐
│         PUBLIC TESTNET STACK                 │
├──────────────────────────────────────────────┤
│                                              │
│  ⛓️  Sepolia Testnet                         │
│      - RPC: Infura/Alchemy                   │
│      - FREE test ETH from faucet             │
│      - Public blockchain                     │
│                                              │
│  🗄️  MySQL Database (Cloud)                  │
│      - PlanetScale (free tier)               │
│      - Railway (free tier)                   │
│                                              │
│  ☁️  Pinata IPFS (Same)                      │
│      - Free tier: 1GB                        │
│                                              │
│  🚀 Backend Server (Cloud)                   │
│      - Render (free tier)                    │
│      - Railway (free tier)                   │
│                                              │
└──────────────────────────────────────────────┘

Total Cost: ₱0 (Still FREE!)
```

---

## 📊 **API ENDPOINTS SUMMARY**

### **Authentication:**
- `POST /api/auth/register` - Register with auto wallet generation
- `POST /api/auth/login` - Login with JWT
- `GET /api/auth/session` - Get current user

### **Profiles:**
- `GET /api/profile/patient/my` - Get patient profile
- `PUT /api/profile/patient/my` - Update patient profile
- `GET /api/profile/doctor/my` - Get doctor profile
- `PUT /api/profile/doctor/my` - Update doctor profile
- `GET /api/profile/staff/my` - Get staff profile
- `PUT /api/profile/staff/my` - Update staff profile

### **Medical Records:**
- `POST /api/upload` - Upload medical record (to IPFS + blockchain)
- `GET /api/records/my` - Get my records (patient)
- `GET /api/records/patient/:id` - View patient records (doctor)
- `GET /api/records/:id/download` - Download record file

### **Access Control:**
- `POST /api/access-requests/request` - Request patient access (doctor)
- `GET /api/access-requests/my` - View pending requests (patient)
- `GET /api/access-requests/my-outgoing` - View sent requests (doctor)
- `POST /api/access-requests/:address/approve` - Approve request
- `POST /api/access-requests/:address/deny` - Deny request
- `GET /api/permissions/my` - View authorized users
- `POST /api/permissions/:address/revoke` - Revoke access

### **Dashboard:**
- `GET /api/dashboard/patient` - Patient dashboard metrics
- `GET /api/dashboard/doctor` - Doctor dashboard metrics
- `GET /api/patients/my` - Doctor's authorized patients

### **Audit:**
- `GET /api/audit-log` - View blockchain audit trail

---

## 🎓 **THESIS CONTRIBUTIONS**

### **Novel Aspects:**

1. **Hybrid Architecture**
   - On-chain: Permissions, audit trail (immutable)
   - Off-chain: Sensitive data, metadata (privacy)
   - Best of both worlds

2. **Backend-Managed Wallets**
   - No MetaMask required
   - Automatic wallet generation
   - User-friendly for non-technical users
   - Suitable for healthcare setting

3. **Gas-Optimized Design**
   - Minimal on-chain storage
   - Event-driven audit trail
   - Cost-effective for healthcare

4. **Complete Access Control**
   - Patient-controlled permissions
   - Blockchain-enforced access
   - Immutable audit trail
   - Revocable access

### **Research Questions Addressed:**

1. ✅ Can blockchain improve EHR security?
   - YES: Immutable audit trail, tamper-proof permissions

2. ✅ Can patients control their data?
   - YES: Patient-controlled access, blockchain enforced

3. ✅ Is it cost-effective?
   - YES: FREE for development, low cost for production

4. ✅ Is it user-friendly?
   - YES: No blockchain knowledge needed, automatic wallets

---

## 📈 **SCALABILITY & FUTURE WORK**

### **Current Capacity:**
- ✅ Ganache: Unlimited transactions (local)
- ✅ Pinata Free: 1GB storage (~1000 medical records)
- ✅ MySQL: Unlimited (local)

### **Future Enhancements:**
1. **Emergency Access**
   - Multi-signature approval
   - Time-locked overrides

2. **Blockchain Migration**
   - Move to public testnet (Sepolia)
   - Eventually to mainnet

3. **Advanced Features**
   - Record sharing between hospitals
   - Smart contract-based consent
   - Machine learning on encrypted data

4. **Mobile App**
   - React Native frontend
   - QR code for quick access
   - Push notifications

---

## ✅ **SYSTEM READINESS**

### **Complete Features:**
- ✅ User authentication with blockchain wallets
- ✅ Role-based access (Patient, Doctor, Staff)
- ✅ Medical record upload to IPFS
- ✅ Blockchain-enforced permissions
- ✅ Access request flow
- ✅ Audit trail (immutable)
- ✅ Record encryption
- ✅ Private key encryption
- ✅ Dashboard metrics
- ✅ Profile management

### **Ready For:**
- ✅ Thesis demo
- ✅ Defense presentation
- ✅ System testing
- ✅ Documentation
- ✅ Paper publication

---

## 📞 **QUICK REFERENCE**

### **Start All Services:**
```bash
# 1. Start Ganache (GUI or CLI)
ganache --deterministic

# 2. Start MySQL
# (Already running as service)

# 3. Start Backend
cd ehr-backend
npm run dev
```

### **Deploy Contract:**
```bash
cd smart-contracts
npm run deploy:ganache
# Copy contract address to ehr-backend/.env.dev
```

### **Test API:**
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"Test123!","role":"PATIENT","gender":"MALE","dateOfBirth":"1990-01-01","phoneNumber":"+639111111111"}'
```

---

**Architecture Documentation Complete!** 🎉

Para sa detailed setup instructions, tingnan ang:
- **BLOCKCHAIN-SETUP-GUIDE-TAGALOG.md** (Complete guide)
- **QUICK-START-CHECKLIST.md** (Step-by-step)
- **verify-setup.md** (Verification tests)

**Good luck sa thesis defense!** 🚀🎓

