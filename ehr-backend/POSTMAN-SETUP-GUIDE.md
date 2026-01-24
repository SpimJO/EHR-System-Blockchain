# 📮 POSTMAN SETUP GUIDE - EHR Blockchain Backend

## 🔧 BASE CONFIGURATION

### 1. **Collection Settings**
```
Collection Name: ehr-blockchain
Base URL: http://localhost:3000/api/v1
```

### 2. **Headers na Kailangan sa LAHAT ng Requests**

#### I-add sa **Collection-level Headers**:
```
x-api-key: eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==
Content-Type: application/json
```

#### Para sa Authenticated Endpoints (I-add pagkatapos mag-login):
```
Authorization: Bearer {{token}}
```

---

## 📁 FOLDER ORGANIZATION

```
ehr-blockchain/
├── 1. Authentication
├── 2. Profile Management
├── 3. Medical Records
├── 4. Access Management
├── 5. Permissions
├── 6. Audit Logs
├── 7. Dashboard
└── 8. Patients (Doctor/Staff)
```

---

## 🔐 1. AUTHENTICATION FOLDER

### 🟢 POST - Register User
```
URL: {{base_url}}/auth/register
Method: POST
Headers: x-api-key, Content-Type: application/json

Body (raw JSON):
{
  "email": "patient@test.com",
  "password": "password123",
  "fullName": "Juan Dela Cruz",
  "role": "PATIENT",
  "gender": "MALE",
  "dateOfBirth": "1990-01-15"
}

Optional Fields:
- gender: "MALE" | "FEMALE" | "OTHER" (default: "OTHER")
- dateOfBirth: "YYYY-MM-DD" (default: today)

Response:
{
  "blockchainAddress": "0x1234...",
  "message": "User registered successfully with blockchain wallet"
}
```

**📝 Test Data:**
- **PATIENT**: patient@test.com
- **DOCTOR**: doctor@test.com
- **STAFF**: staff@test.com
- Password: password123 (lahat)
- Gender: MALE, FEMALE, or OTHER only

---

### 🟢 POST - Login (Email/Password)
```
URL: {{base_url}}/auth/login
Method: POST
Headers: (Use collection headers)

Body (raw JSON):
{
  "email": "patient@test.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {...}
}
```

**⚠️ IMPORTANT**: I-copy ang `token` sa response at i-save bilang Collection Variable!

**Steps after login:**
1. Copy ang token value
2. Go to Collection Variables
3. Create variable: `token`
4. Paste ang value
5. Save

---

### 🟢 POST - Request MetaMask Nonce
```
URL: {{base_url}}/auth/metamask/request-nonce
Method: POST
Headers: (Use collection headers)

Body (raw JSON):
{
  "walletAddress": "0x1234..."
}

Response:
{
  "nonce": "abc123...",
  "message": "Sign this message to authenticate..."
}
```

---

## 👤 2. PROFILE MANAGEMENT FOLDER

### 🟢 GET - My Profile
```
URL: {{base_url}}/users/me
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}

Response:
{
  "id": "...",
  "fullName": "Juan Dela Cruz",
  "email": "patient@test.com",
  "role": "PATIENT",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "bloodGroup": "O+",
  "phoneNumber": "09123456789",
  "address": "123 Main St"
}
```

---

### 🟡 PUT - Update My Profile
```
URL: {{base_url}}/users/me
Method: PUT
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}

Body (raw JSON):
{
  "fullName": "Juan P. Dela Cruz",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "phoneNumber": "09171234567",
  "address": "456 New Address, Manila"
}

Valid Gender Values: "MALE", "FEMALE", "OTHER"
Valid Blood Groups: "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"

Response: (Updated profile object)
```

---

## 📄 3. MEDICAL RECORDS FOLDER

### 🟢 GET - My Records
```
URL: {{base_url}}/records/my
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

Response:
{
  "total": 5,
  "records": [
    {
      "id": "...",
      "title": "Lab Results - CBC",
      "recordType": "Lab Result",
      "ipfsHash": "QmXxx...",
      "ipfsHashShort": "QmXxx...abc",
      "encryption": "AES-128",
      "fileSize": 524288,
      "fileSizeFormatted": "512 KB",
      "uploadedAt": "2025-01-20T10:30:00Z",
      "onBlockchain": true
    }
  ]
}
```

---


### 🟢 POST - Upload Record
```
URL: {{base_url}}/upload/record
Method: POST
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
  - Content-Type: multipart/form-data (automatic)
Role Required: PATIENT

Body (form-data):
Key: title         | Value: "X-Ray Results"
Key: recordType    | Value: "X-Ray"
Key: uploadedAt    | Value: "2025-01-24T08:00:00Z"
Key: file          | Type: File | Select file

Response:
{
  "record": {
    "id": "...",
    "title": "X-Ray Results",
    "ipfsHash": "QmXxx..."
  },
  "blockchain": {
    "transactionHash": "0x123...",
    "blockNumber": 1234
  },
  "encryptionKey": "base64key...",
  "iv": "base64iv...",
  "warning": "Save encryption keys securely!"
}
```

**⚠️ IMPORTANT**: 
- I-save ang `encryptionKey` at `iv` para ma-decrypt ang file later!
- Max file size: 10MB

---

## 🔑 4. ACCESS MANAGEMENT FOLDER

### 🟢 GET - My Access Requests (Patient View)
```
URL: {{base_url}}/access-requests/my
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

Response:
{
  "total": 3,
  "requests": [
    {
      "requesterAddress": "0xDoctor123...",
      "requestedAt": 1706083200,
      "status": 0
    }
  ]
}

Status Values:
0 = PENDING
1 = APPROVED
2 = DENIED
```

---

### 🟢 POST - Approve Access Request
```
URL: {{base_url}}/access-requests/0x9f1016Cc3C246A1FBA9859e2A05f8e998F285929/approve
Method: POST
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

⚠️ IMPORTANT: Replace the blockchain address with actual requester address!
Get the address from GET /access-requests/my response.

Body: (empty)

Response:
{
  "transactionHash": "0x456...",
  "requesterAddress": "0xDoctor123...",
  "status": "approved"
}
```

---

### 🟢 POST - Deny Access Request
```
URL: {{base_url}}/access-requests/0x9f1016Cc3C246A1FBA9859e2A05f8e998F285929/deny
Method: POST
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

⚠️ IMPORTANT: Replace the blockchain address with actual requester address!
Get the address from GET /access-requests/my response.

Body: (empty)

Response:
{
  "transactionHash": "0x789...",
  "requesterAddress": "0xDoctor123...",
  "status": "denied"
}
```

---

### 🟢 POST - Request Access (Doctor/Staff)
```
URL: {{base_url}}/access-requests/request
Method: POST
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: DOCTOR or STAFF

⚠️ MUST LOGIN AS DOCTOR OR STAFF! Patient cannot use this endpoint.

Body (raw JSON):
{
  "patientId": "cm463d9c9f-4d43-4dd8-af2a-4f9ce5d2771b",
  "reason": "Need to review medical history for upcoming surgery"
}

📝 Get patientId from:
1. Register a patient account
2. Login as patient and check GET /users/me response (copy the 'id' field)
3. Logout and login as DOCTOR/STAFF
4. Use that patient ID here

Response:
{
  "requestId": "...",
  "transactionHash": "0xabc...",
  "status": "pending"
}
```

---

### 🟢 GET - My Outgoing Requests (Doctor/Staff)
```
URL: {{base_url}}/access-requests/my-outgoing
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: DOCTOR or STAFF

Response:
{
  "total": 5,
  "requests": [...]
}
```

---

## 🔐 5. PERMISSIONS FOLDER

### 🟢 GET - My Permissions
```
URL: {{base_url}}/permissions/my
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

Response:
{
  "total": 2,
  "permissions": [
    {
      "userAddress": "0xDoctor123...",
      "isActive": true
    }
  ]
}
```

---

### 🟢 POST - Revoke Permission
```
URL: {{base_url}}/permissions/0x9f1016Cc3C246A1FBA9859e2A05f8e998F285929/revoke
Method: POST
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

⚠️ IMPORTANT: Replace the blockchain address with actual user address!
Get the address from GET /permissions/my response.

Body: (empty)

Response:
{
  "transactionHash": "0xdef...",
  "revokedAddress": "0xDoctor123...",
  "status": "revoked"
}
```

---

## 📜 6. AUDIT LOGS FOLDER

### 🟢 GET - My Audit Log
```
URL: {{base_url}}/audit-log/my
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

Query Parameters (optional):
- limit=50 (max 100)
- offset=0
- actionType=RECORD_UPLOADED

Response:
{
  "total": 23,
  "offset": 0,
  "limit": 50,
  "immutable": true,
  "source": "Ethereum Blockchain",
  "entries": [
    {
      "action": "RECORD_UPLOADED",
      "description": "Medical record uploaded",
      "actor": "0xPatient123...",
      "timestamp": 1706083200,
      "date": "2025-01-24T08:00:00Z",
      "transactionHash": "0x123...",
      "blockNumber": 1234,
      "etherscanUrl": "https://etherscan.io/tx/0x123..."
    }
  ]
}
```

---


## 📊 7. DASHBOARD FOLDER

### 🟢 GET - Patient Dashboard
```
URL: {{base_url}}/dashboard/patient
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: PATIENT

Response:
{
  "user": {
    "id": "...",
    "fullName": "Juan Dela Cruz",
    "email": "patient@test.com"
  },
  "cards": {
    "totalRecords": 5,
    "authorizedUsers": 2,
    "pendingRequests": 1
  },
  "recentActivities": [
    {
      "action": "RECORD_UPLOADED",
      "timestamp": 1706083200,
      "description": "..."
    }
  ]
}
```

---

## 👥 8. PATIENTS FOLDER (Doctor/Staff Only)

### 🟢 GET - My Patients
```
URL: {{base_url}}/patients/my
Method: GET
Headers:
  - x-api-key: ...
  - Authorization: Bearer {{token}}
Role Required: DOCTOR or STAFF

Response:
{
  "total": 10,
  "patients": [
    {
      "id": "...",
      "fullName": "Juan Dela Cruz",
      "email": "patient@test.com",
      "accessStatus": "approved"
    }
  ]
}
```

---

## 🔧 COLLECTION VARIABLES SETUP

1. Click sa **ehr-blockchain** collection
2. Go to **Variables** tab
3. I-add ang mga sumusunod:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| base_url | `http://localhost:3000/api/v1` | Same |
| token | (leave blank) | (paste after login) |
| api_key | `eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==` | Same |

4. Click **Save**

---

## 🎯 PRE-REQUEST SCRIPT (Collection Level)

```javascript
// Auto-set API key header
pm.request.headers.add({
    key: 'x-api-key',
    value: pm.collectionVariables.get('api_key')
});

// Auto-set token if exists
const token = pm.collectionVariables.get('token');
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: `Bearer ${token}`
    });
}
```

---

## 🧪 TESTS SCRIPT (Collection Level)

Para ma-auto save ang token after login:

```javascript
// Auto-save token from login/register
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    
    if (jsonData.token) {
        pm.collectionVariables.set('token', jsonData.token);
        console.log('✅ Token saved!');
    }
}

// Log response time
console.log(`⏱️ Response time: ${pm.response.responseTime}ms`);
```

---

## 📝 TESTING WORKFLOW

### Step 1: Register/Login
```
1. POST /auth/register or /auth/login
2. Token auto-saved sa collection variables
3. Ready na for authenticated requests
```

### Step 2: Update Profile
```
1. GET /users/me - Check current profile
2. PUT /users/me - Update info
```

### Step 3: Upload Medical Record
```
1. POST /upload/record
2. Use form-data (NOT raw JSON)
3. Attach file
4. Save encryption keys!
```

### Step 4: View Records
```
1. GET /records/my - List all
2. GET /records/:id - View specific
```

### Step 5: Access Management
```
Patient:
- GET /access-requests/my

Doctor/Staff:
- POST /access-requests/request
```

### Step 6: Permissions
```
- GET /permissions/my
```


## ⚠️ COMMON ERRORS

### 401 Unauthorized
```
❌ Issue: Missing or invalid token
✅ Fix: Login again, copy new token
```

### 403 Forbidden
```
❌ Issue: Wrong role (e.g., STAFF trying patient endpoint)
✅ Fix: Use correct account type
```

### 400 Bad Request
```
❌ Issue: Missing required fields
✅ Fix: Check request body format
```

### Missing API Key
```
❌ Issue: x-api-key header not set
✅ Fix: Add to collection-level headers
```

---

## 🎨 POSTMAN ENVIRONMENT SETUP (Optional)

Para sa multiple environments (dev, staging, prod):

### Development Environment
```json
{
  "name": "EHR Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "api_key",
      "value": "eyJpdiI6..."
    }
  ]
}
```

---

## 📌 QUICK REFERENCE CARD

```
BASE URL: http://localhost:3000/api/v1
API KEY: eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==

HEADERS (All Requests):
✅ x-api-key: <API_KEY>
✅ Content-Type: application/json

HEADERS (Authenticated):
✅ Authorization: Bearer <TOKEN>

ROLES:
- PATIENT: Can upload, view records, manage permissions
- DOCTOR: Can request access, view granted records
- STAFF: Can request access, view granted records
```

---

## 🚀 READY TO TEST!

1. ✅ Import collection sa Postman
2. ✅ Set collection variables
3. ✅ Add pre-request scripts
4. ✅ Test login endpoint
5. ✅ Explore other endpoints

Happy Testing! 🎉
