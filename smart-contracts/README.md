# EHR Smart Contracts

Smart contracts para sa EHR Blockchain System.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Ganache
- Open Ganache GUI
- Click "QUICKSTART ETHEREUM"
- Make sure RPC Server is: `http://127.0.0.1:7545`

### 3. Configure Hardhat
Edit `hardhat.config.ts`:
1. Open Ganache
2. Click key icon 🔑 sa Account 0
3. Copy private key
4. Paste sa `networks.ganache.accounts` array

### 4. Compile Contract
```bash
npm run compile
```

### 5. Deploy to Ganache
```bash
npm run deploy:ganache
```

### 6. Copy Contract Address
After deployment, copy yung contract address at i-add sa `ehr-backend/.env.dev`:
```
EHR_CONTRACT_ADDRESS=0x...
```

## Available Commands

- `npm run compile` - Compile smart contracts
- `npm run deploy:ganache` - Deploy to Ganache local blockchain
- `npm run deploy:localhost` - Deploy to Hardhat local network
- `npm run test` - Run contract tests
- `npm run node` - Start Hardhat local node

## Contract Functions

### Patient Functions
- `uploadRecord(recordId, ipfsHash)` - Upload medical record
- `approveAccess(requesterAddress)` - Approve access request
- `denyAccess(requesterAddress)` - Deny access request
- `revokeAccess(userAddress)` - Revoke existing access

### Doctor/Staff Functions
- `requestAccess(patientAddress)` - Request access to patient records

### View Functions
- `getPatientRecordCount(patientAddress)` - Get record count
- `getPatientRecords(patientAddress)` - Get all records
- `getAuthorizedUsers(patientAddress)` - Get authorized users
- `getPendingAccessRequests(patientAddress)` - Get pending requests
- `hasAccess(patientAddress, userAddress)` - Check access permission

## Events

- `RecordUploaded` - When patient uploads record
- `AccessRequested` - When doctor requests access
- `AccessGranted` - When patient approves access
- `AccessRevoked` - When patient revokes access

