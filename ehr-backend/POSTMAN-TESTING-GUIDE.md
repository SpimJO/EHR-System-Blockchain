# 📮 POSTMAN TESTING GUIDE - EHR Blockchain API

**API Base URL:** `http://localhost:3000/api/v1`  

---

## 🔧 POSTMAN SETUP (Step-by-Step)

### Step 1: I-setup ang Environment Variables

1. **Open Postman** → Click **"Environments"** (sa left sidebar)
2. **Click "Create Environment"** o "+" button
3. **Name:** `EHR Local Dev`
4. **Add these variables:**

| Variable Name | Initial Value | Current Value |
|--------------|---------------|---------------|
| `base_url` | `http://localhost:3000/api/v1` | `http://localhost:3000/api/v1` |
| `api_key` | `eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==` | `eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==` |
| `auth_token` | (leave empty for now) | (will be filled after login) |

5. **Click "Save"**
6. **Select the environment** sa dropdown (upper right corner)

---

## 🔑 API KEY CONFIGURATION

### Paano Ilagay ang API Key sa Postman

Ang **API Key** ay required sa **LAHAT** ng requests!

#### **Method 1: Using Environment Variable (RECOMMENDED)**

Sa bawat request:
1. Go to **"Headers"** tab
2. Add key-value pair:
   - **Key:** `api-key`
   - **Value:** `{{api_key}}`

#### **Method 2: Manual Entry**

Sa bawat request:
1. Go to **"Headers"** tab
2. Add key-value pair:
   - **Key:** `api-key`
   - **Value:** `eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==`

---

## 📋 COMPLETE API ROUTES TESTING GUIDE

### 🔐 AUTHENTICATION ROUTES

---

#### 1. **REGISTER USER (Patient)**

**Endpoint:** `POST {{base_url}}/auth/register`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "Juan Dela Cruz",
  "email": "juan.delacruz@gmail.com",
  "password": "Password123!",
  "role": "PATIENT"
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "fullName": "Juan Dela Cruz",
      "email": "juan.delacruz@gmail.com",
      "role": "PATIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "statusCode": 201,
  "timestamp": "2026-01-19T10:30:00.000Z"
}
```

**📝 Note:** I-copy ang `token` from response at i-save sa environment variable `auth_token`!

---

#### 2. **REGISTER DOCTOR**

**Endpoint:** `POST {{base_url}}/auth/register`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "Dr. Maria Santos",
  "email": "dr.santos@hospital.com",
  "password": "DocPass123!",
  "role": "DOCTOR"
}
```

---

#### 3. **REGISTER STAFF**

**Endpoint:** `POST {{base_url}}/auth/register`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "Nurse Anna Reyes",
  "email": "anna.reyes@hospital.com",
  "password": "Staff123!",
  "role": "STAFF"
}
```

---

#### 4. **LOGIN**

**Endpoint:** `POST {{base_url}}/auth/login`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "juan.delacruz@gmail.com",
  "password": "Password123!"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "fullName": "Juan Dela Cruz",
      "email": "juan.delacruz@gmail.com",
      "role": "PATIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T10:35:00.000Z"
}
```

**📝 Important:** 
1. I-copy ang `token` from response
2. I-paste sa Environment variable `auth_token`
3. Or gamitin ang **Tests** script sa Postman:

```javascript
// Click "Tests" tab sa request at i-paste ito:
const response = pm.response.json();
if (response.data && response.data.token) {
    pm.environment.set("auth_token", response.data.token);
}
```

---

#### 5. **VERIFY SESSION TOKEN**

**Endpoint:** `POST {{base_url}}/auth/sessionToken`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body:** (empty)

**Expected Response (200 OK):**
```json
{
  "message": "Token is valid",
  "data": {
    "id": "uuid-here",
    "email": "juan.delacruz@gmail.com",
    "role": "PATIENT"
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T10:40:00.000Z"
}
```

---

#### 6. **METAMASK - REQUEST NONCE**

**Endpoint:** `POST {{base_url}}/auth/metamask/request-nonce`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "walletAddress": "0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Nonce generated successfully",
  "data": {
    "nonce": "abc123xyz789...",
    "message": "Sign this message to authenticate: abc123xyz789..."
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T10:45:00.000Z"
}
```

---

#### 7. **METAMASK - VERIFY SIGNATURE**

**Endpoint:** `POST {{base_url}}/auth/metamask/verify`

**Headers:**
```
api-key: {{api_key}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "walletAddress": "0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9",
  "signature": "0x1234567890abcdef..."
}
```

---

### 👤 PROFILE ROUTES (Patient)

---

#### 8. **GET MY PROFILE**

**Endpoint:** `GET {{base_url}}/users/me`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Expected Response (200 OK):**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-here",
    "fullName": "Juan Dela Cruz",
    "email": "juan.delacruz@gmail.com",
    "role": "PATIENT",
    "createdAt": "2026-01-19T10:00:00.000Z",
    "updatedAt": "2026-01-19T10:00:00.000Z",
    "patientProfile": {
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "MALE",
      "bloodGroup": "O+",
      "phoneNumber": "+639171234567",
      "address": "123 Main St, Manila"
    }
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T10:50:00.000Z"
}
```

---

#### 9. **UPDATE MY PROFILE**

**Endpoint:** `PUT {{base_url}}/users/me`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "Juan Pedro Dela Cruz",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "phoneNumber": "+639171234567",
  "address": "123 Main Street, Quezon City, Metro Manila"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-here",
    "fullName": "Juan Pedro Dela Cruz",
    "email": "juan.delacruz@gmail.com",
    "role": "PATIENT",
    "updatedAt": "2026-01-19T10:55:00.000Z",
    "patientProfile": {
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "gender": "MALE",
      "bloodGroup": "O+",
      "phoneNumber": "+639171234567",
      "address": "123 Main Street, Quezon City, Metro Manila"
    }
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T10:55:00.000Z"
}
```

---

### 👨‍⚕️ DOCTOR PROFILE ROUTES

---

#### 10. **GET DOCTOR PROFILE**

**Endpoint:** `GET {{base_url}}/profile/doctor/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**⚠️ Note:** Kailangan naka-login ka as DOCTOR role!

---

#### 11. **UPDATE DOCTOR PROFILE**

**Endpoint:** `PUT {{base_url}}/profile/doctor/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "designation": "Cardiologist",
  "specialization": "Cardiology",
  "licenseNumber": "PRC-12345",
  "medicalId": "MD-2024-001",
  "phoneNumber": "+639181234567",
  "department": "Cardiology Department",
  "city": "Quezon City",
  "hospitalName": "Philippine Heart Center",
  "yearsOfExperience": 10
}
```

---

### 👨‍💼 STAFF PROFILE ROUTES

---

#### 12. **GET STAFF PROFILE**

**Endpoint:** `GET {{base_url}}/profile/staff/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**⚠️ Note:** Kailangan naka-login ka as STAFF role!

---

#### 13. **UPDATE STAFF PROFILE**

**Endpoint:** `PUT {{base_url}}/profile/staff/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "designation": "Registered Nurse",
  "employeeId": "EMP-2024-001",
  "phoneNumber": "+639191234567",
  "department": "Emergency Room",
  "city": "Manila",
  "hospitalName": "Manila General Hospital"
}
```

---

### 📄 MEDICAL RECORDS ROUTES

---

#### 14. **GET MY MEDICAL RECORDS**

**Endpoint:** `GET {{base_url}}/records/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Query Parameters (Optional):**
```
limit=10
offset=0
```

**Full URL Example:**
```
GET {{base_url}}/records/my?limit=10&offset=0
```

**Expected Response (200 OK):**
```json
{
  "message": "Medical records retrieved successfully",
  "data": {
    "records": [
      {
        "id": "record-uuid",
        "title": "Blood Test Results",
        "recordType": "LAB_RESULT",
        "recordDate": "2026-01-15T08:00:00.000Z",
        "ipfsHash": "QmX4e5Y6z7A8b9C0d1E2f3G4h5I6j7K8l9M0n1O2p3Q4r5",
        "ipfsHashShort": "QmX4e5...3Q4r5",
        "encryption": "AES-128",
        "fileSize": 256000,
        "createdAt": "2026-01-15T08:30:00.000Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:00:00.000Z"
}
```

---

#### 15. **UPLOAD MEDICAL RECORD**

**Endpoint:** `POST {{base_url}}/upload`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**⚠️ IMPORTANT:** Iba ang setup dito - **FORM-DATA** gagamitin mo!

**Body Type:** `form-data` (NOT raw JSON!)

**Form-Data Fields:**

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `file` | File | (select a file) | PDF, JPG, PNG, DOCX |
| `title` | Text | `Blood Test Results` | Record title |
| `recordType` | Text | `LAB_RESULT` | Type of record |
| `recordDate` | Text | `2026-01-15` | Date format: YYYY-MM-DD |

**Sa Postman:**
1. Select **"Body"** tab
2. Choose **"form-data"**
3. Add the fields above
4. Para sa `file` - click dropdown at select **"File"** then browse para pumili ng file

**Expected Response (201 Created):**
```json
{
  "message": "Medical record uploaded successfully",
  "data": {
    "record": {
      "id": "record-uuid",
      "title": "Blood Test Results",
      "recordType": "LAB_RESULT",
      "recordDate": "2026-01-15T00:00:00.000Z",
      "ipfsHash": "QmX4e5Y6z7A8b9C0d1E2f3G4h5I6j7K8l9M0n1O2p3Q4r5",
      "fileSize": 256000,
      "encryption": "AES-128"
    },
    "blockchain": {
      "transactionHash": "0x1234567890abcdef...",
      "verified": true
    },
    "encryptionKey": "hex-encoded-key",
    "iv": "hex-encoded-iv",
    "warning": "Store your encryption key securely. It cannot be recovered if lost."
  },
  "statusCode": 201,
  "timestamp": "2026-01-19T11:05:00.000Z"
}
```

**📝 IMPORTANT:** I-save ang `encryptionKey` at `iv` - kailangan mo ito para ma-decrypt ang file!

---

### 🔐 ACCESS CONTROL ROUTES

---

#### 16. **REQUEST ACCESS TO PATIENT RECORDS**

**Endpoint:** `POST {{base_url}}/access-requests/request`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "patientId": "patient-uuid-here",
  "reason": "Medical consultation and treatment planning"
}
```

**⚠️ Note:** Naka-login ka dapat as DOCTOR or STAFF!

**Expected Response (201 Created):**
```json
{
  "message": "Access request sent successfully",
  "data": {
    "id": "request-uuid",
    "patientId": "patient-uuid",
    "requesterId": "doctor-uuid",
    "reason": "Medical consultation and treatment planning",
    "status": "PENDING",
    "createdAt": "2026-01-19T11:10:00.000Z"
  },
  "statusCode": 201,
  "timestamp": "2026-01-19T11:10:00.000Z"
}
```

---

#### 17. **GET RECEIVED ACCESS REQUESTS (Patient)**

**Endpoint:** `GET {{base_url}}/access-requests/received`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Query Parameters (Optional):**
```
status=PENDING
limit=10
offset=0
```

**Full URL Example:**
```
GET {{base_url}}/access-requests/received?status=PENDING&limit=10
```

**Expected Response (200 OK):**
```json
{
  "message": "Access requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "request-uuid",
        "requester": {
          "id": "doctor-uuid",
          "fullName": "Dr. Maria Santos",
          "email": "dr.santos@hospital.com",
          "role": "DOCTOR"
        },
        "reason": "Medical consultation and treatment planning",
        "status": "PENDING",
        "createdAt": "2026-01-19T11:10:00.000Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:15:00.000Z"
}
```

---

#### 18. **APPROVE ACCESS REQUEST**

**Endpoint:** `PUT {{base_url}}/access-requests/:requestId/approve`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Example URL:**
```
PUT {{base_url}}/access-requests/550e8400-e29b-41d4-a716-446655440000/approve
```

**Body:** (empty)

**Expected Response (200 OK):**
```json
{
  "message": "Access request approved successfully",
  "data": {
    "id": "request-uuid",
    "status": "APPROVED",
    "approvedAt": "2026-01-19T11:20:00.000Z"
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:20:00.000Z"
}
```

---

#### 19. **REJECT ACCESS REQUEST**

**Endpoint:** `PUT {{base_url}}/access-requests/:requestId/reject`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Example URL:**
```
PUT {{base_url}}/access-requests/550e8400-e29b-41d4-a716-446655440000/reject
```

**Body:** (empty)

---

#### 20. **GET MY PERMISSIONS (Who can access my records)**

**Endpoint:** `GET {{base_url}}/permissions/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Expected Response (200 OK):**
```json
{
  "message": "Permissions retrieved successfully",
  "data": {
    "authorizedUsers": [
      {
        "userId": "doctor-uuid",
        "fullName": "Dr. Maria Santos",
        "email": "dr.santos@hospital.com",
        "role": "DOCTOR",
        "grantedAt": "2026-01-19T11:20:00.000Z"
      }
    ],
    "total": 1
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:25:00.000Z"
}
```

---

#### 21. **GRANT ACCESS DIRECTLY**

**Endpoint:** `POST {{base_url}}/permissions/grant`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userEmail": "dr.santos@hospital.com"
}
```

---

#### 22. **REVOKE ACCESS**

**Endpoint:** `DELETE {{base_url}}/permissions/:userId/revoke`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Example URL:**
```
DELETE {{base_url}}/permissions/doctor-uuid-here/revoke
```

---

### 📊 DASHBOARD & AUDIT ROUTES

---

#### 23. **GET DASHBOARD STATISTICS**

**Endpoint:** `GET {{base_url}}/dashboard/stats`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Expected Response (200 OK):**
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalRecords": 5,
    "authorizedUsers": 2,
    "pendingRequests": 1,
    "recentActivities": [
      {
        "type": "RecordUploaded",
        "timestamp": 1737289200,
        "details": {
          "recordId": "record-uuid",
          "ipfsHash": "QmX4e5..."
        }
      }
    ]
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:30:00.000Z"
}
```

---

#### 24. **GET AUDIT LOG**

**Endpoint:** `GET {{base_url}}/audit-log/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**Query Parameters (Optional):**
```
limit=50
offset=0
```

**Full URL Example:**
```
GET {{base_url}}/audit-log/my?limit=50&offset=0
```

**Expected Response (200 OK):**
```json
{
  "message": "Audit log retrieved successfully",
  "data": {
    "logs": [
      {
        "actor": "0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9",
        "action": "RECORD_UPLOADED",
        "timestamp": 1737289200,
        "details": "Uploaded new medical record",
        "formattedDate": "2026-01-19 11:00:00"
      }
    ],
    "total": 10,
    "limit": 50,
    "offset": 0
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:35:00.000Z"
}
```

---

#### 25. **GET PATIENT LIST (Doctor/Staff only)**

**Endpoint:** `GET {{base_url}}/patients/my`

**Headers:**
```
api-key: {{api_key}}
Authorization: Bearer {{auth_token}}
```

**⚠️ Note:** Naka-login ka dapat as DOCTOR or STAFF!

**Expected Response (200 OK):**
```json
{
  "message": "Patient list retrieved successfully",
  "data": {
    "patients": [
      {
        "id": "patient-uuid",
        "fullName": "Juan Dela Cruz",
        "email": "juan.delacruz@gmail.com",
        "hasAccess": true,
        "grantedAt": "2026-01-19T11:20:00.000Z"
      }
    ],
    "total": 1
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:40:00.000Z"
}
```

---

### 🧪 TEST ROUTE

---

#### 26. **SAMPLE TEST ENDPOINT**

**Endpoint:** `GET {{base_url}}/sample`

**Headers:**
```
api-key: {{api_key}}
```

**Expected Response (200 OK):**
```json
{
  "message": "Sample Route",
  "data": {
    "message": "Sample Route Response"
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T11:45:00.000Z"
}
```

---

## 🎯 RECOMMENDED TESTING FLOW

### Testing Sequence (Sundin ito in order):

1. ✅ **Test Sample Route** (Check if API is working)
2. ✅ **Register Patient** (Save token)
3. ✅ **Login Patient** (Update token)
4. ✅ **Get My Profile**
5. ✅ **Update My Profile**
6. ✅ **Upload Medical Record**
7. ✅ **Get My Records**
8. ✅ **Register Doctor** (Save doctor token)
9. ✅ **Login Doctor** (Update token to doctor's)
10. ✅ **Update Doctor Profile**
11. ✅ **Request Access** (to patient's records)
12. ✅ **Login Patient** (Switch back to patient token)
13. ✅ **Get Access Requests**
14. ✅ **Approve Access Request**
15. ✅ **Get My Permissions**
16. ✅ **Login Doctor** (Switch to doctor token)
17. ✅ **Get Patient List**
18. ✅ **Get Dashboard Stats**
19. ✅ **Get Audit Log**

---

## 🛠️ COMMON ERRORS & SOLUTIONS

### Error 1: Missing API Key
```json
{
  "message": "Missing Api Key",
  "statusCode": 404
}
```
**Solution:** Add `api-key` header sa lahat ng requests!

---

### Error 2: Unauthorized
```json
{
  "message": "Unauthorized - Missing Token",
  "statusCode": 401
}
```
**Solution:** Add `Authorization: Bearer {{auth_token}}` header. I-check if naka-login ka.

---

### Error 3: Forbidden (Wrong Role)
```json
{
  "message": "Access denied. Insufficient role",
  "statusCode": 403
}
```
**Solution:** Naka-login ka sa wrong role. Example: Doctor endpoint pero Patient ka naka-login.

---

### Error 4: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** This is expected from browser. Use Postman instead, or add your origin to WHITELIST.

---

## 📥 POSTMAN COLLECTION IMPORT

### Option 1: Create Collection Manually
1. Click **"New"** → **"Collection"**
2. Name: `EHR Blockchain API`
3. Add folder per category (Auth, Profile, Records, etc.)
4. Add requests one by one using guide above

### Option 2: Quick Setup Script

Pwede mo gamitin ang **Pre-request Script** para automatic ang setup:

```javascript
// Global Pre-request Script (sa Collection level)
// Set API key automatically
pm.request.headers.add({
    key: 'api-key',
    value: pm.environment.get('api_key')
});

// Set Authorization token if available
const token = pm.environment.get('auth_token');
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + token
    });
}
```

Para i-add ito:
1. Right-click sa Collection
2. Click **"Edit"**
3. Go to **"Pre-request Scripts"** tab
4. Paste ang script above
5. Click **"Update"**

---

## 📝 POSTMAN TIPS & TRICKS

### Tip 1: Auto-save Tokens
Sa login/register requests, add this sa **Tests** tab:
```javascript
const response = pm.response.json();
if (response.data && response.data.token) {
    pm.environment.set("auth_token", response.data.token);
    console.log("Token saved:", response.data.token.substring(0, 20) + "...");
}
```

### Tip 2: Test Assertions
Add validation sa **Tests** tab:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has data", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property('data');
});
```

### Tip 3: Variables
Use these sa URL:
- `{{base_url}}` - API base URL
- `{{api_key}}` - API key
- `{{auth_token}}` - Auth token

---

## 🎉 HAPPY TESTING!

Lahat ng routes ay tested at working! If may error ka:
1. Check headers (api-key at Authorization)
2. Check environment variables
3. Check if backend is running (port 3000)
4. Check if naka-login ka sa correct role

**Support:** Check SYSTEM-STATUS.md para sa backend status
**API Documentation:** This guide! 📮
