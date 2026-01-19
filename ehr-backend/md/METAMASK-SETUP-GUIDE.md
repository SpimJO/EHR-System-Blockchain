# 🦊 METAMASK SETUP GUIDE - EHR Blockchain System

**Date:** January 19, 2026  
**Purpose:** Complete guide para sa MetaMask installation, configuration, at testing

---

## 📖 TABLE OF CONTENTS

1. [Ano ang MetaMask?](#ano-ang-metamask)
2. [Installation (Browser Extension)](#installation-browser-extension)
3. [MetaMask Setup](#metamask-setup)
4. [Connect to Ganache Network](#connect-to-ganache-network)
5. [Import Ganache Accounts](#import-ganache-accounts)
6. [Backend Code Setup](#backend-code-setup)
7. [Authentication Flow](#authentication-flow)
8. [Testing with Frontend](#testing-with-frontend)
9. [Testing with Postman](#testing-with-postman)
10. [Troubleshooting](#troubleshooting)

---

## 🦊 ANO ANG METAMASK?

**MetaMask** ay isang:
- 🔐 **Crypto Wallet** - Store at manage ng Ethereum accounts
- 🌐 **Browser Extension** - Works sa Chrome, Firefox, Edge, Brave
- 🔑 **Authentication Tool** - Sign messages without gas fees
- 📱 **Mobile App** - Available din sa iOS/Android

### Bakit kailangan natin?

Sa EHR Blockchain System, ginagamit natin ang MetaMask para sa:
1. ✅ **Wallet-based Authentication** - Login using blockchain wallet (alternative sa email/password)
2. ✅ **Sign Transactions** - Approve medical record uploads to blockchain
3. ✅ **Identity Verification** - Prove ownership ng wallet address
4. ✅ **Gas-free Authentication** - Sign messages without spending ETH

### ⚠️ IMPORTANT: Code Setup

**Good news!** ✅ **HINDI NA KAILANGAN NG ADDITIONAL CODE SETUP!**

Ang backend code mo ay **COMPLETE NA** at **READY TO USE**:
- ✅ MetaMask signature verification - implemented
- ✅ Nonce generation - implemented
- ✅ Wallet validation - implemented
- ✅ Authentication endpoints - implemented

**Kailangan mo lang:**
1. Install MetaMask browser extension
2. Setup wallet
3. Connect to Ganache network
4. Test authentication

---

## 🔽 INSTALLATION (Browser Extension)

### Step 1: Download MetaMask

**Option A: Chrome/Brave/Edge**
1. Go to: https://metamask.io/download/
2. Click **"Install MetaMask for Chrome"**
3. Click **"Add to Chrome"**
4. Click **"Add Extension"**

**Option B: Firefox**
1. Go to: https://addons.mozilla.org/firefox/addon/ether-metamask/
2. Click **"Add to Firefox"**

**Option C: Mobile (Optional)**
- iOS: App Store - search "MetaMask"
- Android: Google Play - search "MetaMask"

### Step 2: Verify Installation

1. Look for **Fox icon** 🦊 sa browser toolbar (upper right)
2. Click the icon
3. Should see MetaMask welcome screen

---

## 🔧 METAMASK SETUP

### First Time Setup

#### Option 1: Create New Wallet (For Testing)

1. **Click "Get Started"**
2. **Click "Create a new wallet"**
3. **Agree to terms**
4. **Create Password** (minimum 8 characters)
   - Example: `MetaMask123!`
   - ⚠️ Remember this! Kailangan mo every time mag-unlock ng MetaMask
5. **Secure Wallet (Secret Recovery Phrase)**
   - Click **"Secure my wallet"**
   - **VERY IMPORTANT:** I-write down ang 12 words sa safe place!
   - Example: `witch collapse practice feed shame open despair creek road again ice least`
   - ⚠️ **NEVER SHARE** this with anyone!
   - ⚠️ Pag nawala mo ito, **FOREVER LOST** ang wallet mo!
6. **Confirm Recovery Phrase**
   - I-arrange ang words in correct order
7. **Click "Got it!"**

✅ **Wallet Created!** Default account: **Account 1**

#### Option 2: Import Existing Wallet

1. Click **"Import an existing wallet"**
2. Enter your 12-word recovery phrase
3. Create new password
4. Click **"Import"**

---

## 🌐 CONNECT TO GANACHE NETWORK

### Why Connect to Ganache?

Ang production EHR system mo ay **naka-deploy sa Ganache** (local blockchain), hindi sa Ethereum mainnet. Kaya kailangan i-configure ang MetaMask to connect to Ganache.

### Step-by-Step Configuration

#### 1. Open MetaMask

Click the **Fox icon** 🦊 sa browser toolbar

#### 2. Access Network Settings

1. Click **network dropdown** (upper left, default shows "Ethereum Mainnet")
2. Click **"Add Network"**
3. Click **"Add a network manually"** (at the bottom)

#### 3. Enter Ganache Network Details

Fill in the following (EXACTLY as shown):

| Field | Value |
|-------|-------|
| **Network Name** | `Ganache Local` |
| **New RPC URL** | `http://127.0.0.1:7545` |
| **Chain ID** | `1337` |
| **Currency Symbol** | `ETH` |
| **Block Explorer URL** | (leave empty) |

**📋 Copy-Paste Values:**
```
Network Name: Ganache Local
RPC URL: http://127.0.0.1:7545
Chain ID: 1337
Currency Symbol: ETH
```

#### 4. Save Network

1. Click **"Save"**
2. MetaMask will automatically switch to **Ganache Local** network
3. You should see **"Ganache Local"** sa network dropdown

#### 5. Verify Connection

1. ✅ Network name shows **"Ganache Local"**
2. ✅ Balance shows **0 ETH** (kasi new account)
3. ✅ No error messages

---

## 💰 IMPORT GANACHE ACCOUNTS

### Why Import Ganache Accounts?

Ang Ganache ay may **pre-funded accounts** (100 ETH each). Para ma-test mo ang system, kailangan mo i-import ang accounts na may ETH balance.

### Get Private Keys from Ganache

#### Method 1: From Ganache UI

1. **Open Ganache** application
2. Click **"Accounts"** tab (kung hindi pa naka-open)
3. You'll see 10 accounts with **100.00 ETH** each
4. **Click the KEY icon** 🔑 sa account row
5. **Copy the Private Key** (example: `0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7`)

#### Method 2: From Backend .env File

Your backend is already configured with a Ganache account:

```dotenv
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

This account address: `0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9`

### Import Account to MetaMask

#### 1. Open MetaMask

Click the **Fox icon** 🦊

#### 2. Access Import Account

1. Click **account icon** (upper right, circle with colored pattern)
2. Click **"Add account or hardware wallet"**
3. Click **"Import account"**

#### 3. Paste Private Key

1. **Select Type:** "Private Key" (should be default)
2. **Paste private key:**
   ```
   0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
   ```
3. Click **"Import"**

#### 4. Verify Import

✅ You should see:
- **New account** (example: "Account 2")
- **Balance: ~99.998 ETH** (slightly less than 100 due to previous transactions)
- **Address:** `0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9`

### Optional: Import More Accounts

Para sa testing, pwede mo i-import more Ganache accounts:

1. Go back to Ganache
2. Copy private key from different account (Account 2, 3, etc.)
3. Repeat import process sa MetaMask
4. Useful for testing:
   - **Account 1** - Doctor
   - **Account 2** - Patient
   - **Account 3** - Staff

---

## 💻 BACKEND CODE SETUP

### ✅ GOOD NEWS: Already Complete!

**WALA NANG ADDITIONAL CODE SETUP NEEDED!** Ang backend mo ay complete na:

### What's Already Implemented:

#### 1. **MetaMask Library** (`src/lib/metamask.ts`)

```typescript
✅ generateNonce() - Create random nonce
✅ generateAuthMessage() - Create sign message
✅ verifySignature() - Verify MetaMask signature
✅ verifySignatureMatch() - Compare with expected address
✅ isValidAddress() - Validate Ethereum address
```

#### 2. **Authentication Endpoints** (`src/network/controllers/auth.controller.ts`)

```typescript
✅ POST /api/v1/auth/metamask/request-nonce
   - Generate nonce for wallet address
   - Returns message to sign

✅ POST /api/v1/auth/metamask/verify
   - Verify signed message
   - Returns JWT token
```

#### 3. **Security Features**

```typescript
✅ Nonce expiration (5 minutes)
✅ Automatic cleanup of expired nonces
✅ Address validation
✅ Signature verification
✅ No wallet storage in database (privacy)
```

### Environment Variables (Already Set)

Your `.env` file already has everything:

```dotenv
✅ BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
✅ BLOCKCHAIN_CHAIN_ID=1337
✅ BLOCKCHAIN_PRIVATE_KEY=0xf23190...
✅ ENC_KEY_SECRET=c5099d70...
✅ API_KEY=eyJpdiI6...
```

### Routes (Already Configured)

File: `src/network/routes/auth.route.ts`

```typescript
✅ authRoutes.post('/metamask/request-nonce', ...)
✅ authRoutes.post('/metamask/verify', ...)
```

---

## 🔄 AUTHENTICATION FLOW

### How MetaMask Authentication Works

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │         │   Backend   │         │   MetaMask   │
│   (React)   │         │  (Express)  │         │  (Browser)   │
└─────────────┘         └─────────────┘         └──────────────┘
      │                        │                        │
      │  1. Request Nonce      │                        │
      ├───────────────────────>│                        │
      │    walletAddress       │                        │
      │                        │                        │
      │  2. Generate Nonce     │                        │
      │     + Message          │                        │
      │<───────────────────────┤                        │
      │                        │                        │
      │  3. Request Signature  │                        │
      ├────────────────────────┼───────────────────────>│
      │    (message to sign)   │                        │
      │                        │                        │
      │  4. User Signs         │                        │
      │     (MetaMask popup)   │                        │
      │<────────────────────────────────────────────────┤
      │    signature           │                        │
      │                        │                        │
      │  5. Send Signature     │                        │
      ├───────────────────────>│                        │
      │  walletAddress +       │                        │
      │  signature             │                        │
      │                        │                        │
      │                        │  6. Verify Signature   │
      │                        │     (ethers.js)        │
      │                        │                        │
      │  7. Return JWT Token   │                        │
      │<───────────────────────┤                        │
      │                        │                        │
      │  8. Use Token for      │                        │
      │     API Requests       │                        │
      ├───────────────────────>│                        │
```

### Step Details

#### **Step 1: Request Nonce**
- Frontend sends wallet address to backend
- Backend generates random nonce (32 bytes hex)
- Backend creates message to sign

#### **Step 2: Generate Message**
```
Welcome to EHR Blockchain System

Sign this message to authenticate.

Nonce: 0x1234567890abcdef...

This request will not trigger a blockchain transaction or cost any gas fees.
```

#### **Step 3-4: Sign Message**
- Frontend calls MetaMask to sign message
- **MetaMask popup appears** 🦊
- User clicks **"Sign"** button
- **NO GAS FEES** - This is just a signature, not a transaction!

#### **Step 5-6: Verify Signature**
- Frontend sends signature to backend
- Backend uses `ethers.verifyMessage()` to recover wallet address
- Backend compares recovered address with claimed address

#### **Step 7: Issue Token**
- If signature valid, backend creates JWT token
- Token contains user info (id, email, role)
- Frontend stores token in localStorage

#### **Step 8: Authenticated**
- Use token for all API requests
- Same flow as email/password login

---

## 🎨 TESTING WITH FRONTEND

### Prerequisites

1. ✅ Backend running (`npm run dev` in ehr-backend)
2. ✅ Ganache running (port 7545)
3. ✅ MetaMask installed and connected to Ganache
4. ✅ Ganache account imported to MetaMask

### Frontend Implementation (React + ethers.js)

**Kailangan i-install ang ethers.js sa frontend:**

```bash
cd ehr-frontend
npm install ethers@6.16.0
```

### Sample Login Component

```typescript
import { BrowserProvider } from 'ethers';
import { useState } from 'react';

function MetaMaskLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMetaMaskLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // 2. Request account access
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const walletAddress = accounts[0];

      console.log('Connected wallet:', walletAddress);

      // 3. Request nonce from backend
      const nonceResponse = await fetch('http://localhost:3000/api/v1/auth/metamask/request-nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ=='
        },
        body: JSON.stringify({ walletAddress })
      });

      const { data } = await nonceResponse.json();
      console.log('Nonce received:', data.nonce);

      // 4. Sign message with MetaMask
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(data.message);
      console.log('Message signed:', signature);

      // 5. Verify signature and get token
      const verifyResponse = await fetch('http://localhost:3000/api/v1/auth/metamask/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ=='
        },
        body: JSON.stringify({ walletAddress, signature })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyData.data && verifyData.data.token) {
        // 6. Store token
        localStorage.setItem('auth_token', verifyData.data.token);
        console.log('Login successful!');
        alert('✅ MetaMask login successful!');
      } else {
        throw new Error('Invalid signature');
      }

    } catch (err: any) {
      console.error('MetaMask login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleMetaMaskLogin}
        disabled={loading}
        className="metamask-button"
      >
        {loading ? 'Connecting...' : '🦊 Login with MetaMask'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default MetaMaskLogin;
```

### What Happens When User Clicks Button:

1. **MetaMask popup appears** asking to connect
2. User clicks **"Next"** → **"Connect"**
3. **Another MetaMask popup** asking to sign message
4. User clicks **"Sign"**
5. **Login successful!** Token saved to localStorage

---

## 📮 TESTING WITH POSTMAN

### Step 1: Request Nonce

**Endpoint:** `POST http://localhost:3000/api/v1/auth/metamask/request-nonce`

**Headers:**
```
api-key: eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "walletAddress": "0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9"
}
```

**Expected Response:**
```json
{
  "message": "Nonce generated successfully",
  "data": {
    "walletAddress": "0x95221a341576d1e747ea6fa3bb8274a78c41d6f9",
    "nonce": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    "message": "Welcome to EHR Blockchain System\n\nSign this message to authenticate.\n\nNonce: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890\n\nThis request will not trigger a blockchain transaction or cost any gas fees."
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T12:00:00.000Z"
}
```

**📝 I-copy ang `message` field!**

### Step 2: Sign Message with MetaMask

⚠️ **Problem:** Hindi pwede i-sign ang message directly sa Postman. Kailangan ng MetaMask.

**Solution Options:**

#### **Option A: Use Browser Console (EASIEST)**

1. **Open browser** (with MetaMask installed)
2. Go to `http://localhost:5173` (or any page)
3. Press **F12** to open DevTools
4. Go to **Console** tab
5. **Paste this script** (update the message from Step 1):

```javascript
// Replace with YOUR message from Step 1 response
const message = "Welcome to EHR Blockchain System\n\nSign this message to authenticate.\n\nNonce: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";

// Request MetaMask to sign
ethereum.request({
  method: 'personal_sign',
  params: [message, '0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9']
}).then(signature => {
  console.log('Signature:', signature);
  // Copy this signature for Step 3!
});
```

6. Press **Enter**
7. **MetaMask popup appears**
8. Click **"Sign"**
9. **Copy the signature** from console output

#### **Option B: Use Frontend**

1. Create a simple HTML file with the React component above
2. Click the button
3. Check console logs for signature

### Step 3: Verify Signature

**Endpoint:** `POST http://localhost:3000/api/v1/auth/metamask/verify`

**Headers:**
```
api-key: eyJpdiI6IkVoK09CeHVMcllnRVprL3Jmb3N2Q0E9PSIsImRhdGEiOiJsSzJya3FvSmgza2tPNHIxZS9Kanl3PT0ifQ==
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "walletAddress": "0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9",
  "signature": "0x1234567890abcdef..."
}
```
*(Replace signature with the one from Step 2)*

**Expected Response:**
```json
{
  "message": "MetaMask authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "walletAddress": "0x95221a341576d1e747ea6fa3bb8274a78c41d6f9"
  },
  "statusCode": 200,
  "timestamp": "2026-01-19T12:05:00.000Z"
}
```

✅ **Success!** I-save ang token para sa future requests.

---

## 🐛 TROUBLESHOOTING

### Issue 1: "MetaMask is not installed"

**Symptoms:**
```javascript
Error: Please install MetaMask!
```

**Solution:**
1. Install MetaMask browser extension
2. Refresh the page
3. Check if `window.ethereum` exists:
   ```javascript
   console.log('MetaMask:', !!window.ethereum);
   ```

---

### Issue 2: "Wrong network"

**Symptoms:**
```
Error: Network mismatch
```

**Solution:**
1. Open MetaMask
2. Check network dropdown (upper left)
3. Should show **"Ganache Local"**
4. If not, manually switch to Ganache Local

---

### Issue 3: "Nonce not found"

**Symptoms:**
```json
{
  "message": "Nonce not found. Please request a new nonce."
}
```

**Solutions:**

**Cause A: Nonce expired (5 minutes)**
- Request new nonce (Step 1)
- Sign immediately after receiving nonce

**Cause B: Wrong wallet address**
- Make sure using same address for both steps
- Check case sensitivity (use lowercase)

**Cause C: Backend restarted**
- Nonces stored in memory (Map)
- Request new nonce after backend restart

---

### Issue 4: "Invalid signature"

**Symptoms:**
```json
{
  "message": "Invalid signature"
}
```

**Solutions:**

**Cause A: Wrong message signed**
- Make sure signing EXACT message from Step 1
- Include all newlines (`\n`)
- Don't modify the message

**Cause B: Wrong wallet used**
- Make sure same wallet for nonce request and signing
- Check MetaMask selected account

**Cause C: Signature format issue**
- Signature should start with `0x`
- Should be 132 characters long
- Example: `0x1234567890abcdef...` (130 hex chars + `0x`)

---

### Issue 5: "Cannot connect to Ganache"

**Symptoms:**
```
Error: Network error
```

**Solutions:**

1. **Check if Ganache is running**
   ```bash
   # Should see Ganache window open
   # Or check if port 7545 is listening
   ```

2. **Verify RPC URL in MetaMask**
   - Open MetaMask
   - Settings → Networks → Ganache Local
   - RPC URL should be: `http://127.0.0.1:7545`
   - NOT `http://localhost:7545` (use 127.0.0.1)

3. **Check backend .env**
   ```dotenv
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
   BLOCKCHAIN_CHAIN_ID=1337
   ```

4. **Restart Ganache**
   - Close Ganache
   - Open again
   - Wait for "Server started on port 7545"

---

### Issue 6: "Transaction failed" during record upload

**Symptoms:**
```
Error: insufficient funds for gas
```

**Solutions:**

1. **Check ETH balance in MetaMask**
   - Should have at least 1 ETH
   - If 0 ETH, import Ganache account with 100 ETH

2. **Check selected network**
   - Must be on **Ganache Local**
   - NOT Ethereum Mainnet

3. **Check gas settings**
   - Gas limit: 6721975 (auto-set)
   - Gas price: 20 Gwei (auto-set)

---

### Issue 7: "User rejected the request"

**Symptoms:**
```
Error: User denied message signature
```

**Solution:**
- User clicked **"Cancel"** in MetaMask popup
- Try again and click **"Sign"**

---

## 📚 ADDITIONAL RESOURCES

### Official Documentation

- **MetaMask Docs:** https://docs.metamask.io/
- **Ethers.js Docs:** https://docs.ethers.org/v6/
- **Ganache Docs:** https://trufflesuite.com/docs/ganache/

### Video Tutorials

- MetaMask Installation: https://www.youtube.com/watch?v=yWfZnjkhhhg
- Connect MetaMask to Ganache: https://www.youtube.com/watch?v=nUEBAS5r4Og

### Testing Tools

- **Remix IDE:** https://remix.ethereum.org/ (for testing smart contracts)
- **Tenderly:** https://tenderly.co/ (for debugging transactions)

---

## ✅ SUMMARY CHECKLIST

### Installation Checklist

- [ ] MetaMask browser extension installed
- [ ] Wallet created (12-word recovery phrase saved)
- [ ] Password set for MetaMask
- [ ] Ganache network added to MetaMask
- [ ] Ganache account imported to MetaMask
- [ ] Balance shows ~99.998 ETH

### Backend Checklist

- [ ] ✅ MetaMask library implemented (src/lib/metamask.ts)
- [ ] ✅ Authentication endpoints implemented (auth.controller.ts)
- [ ] ✅ Routes configured (auth.route.ts)
- [ ] ✅ Environment variables set (.env)
- [ ] Backend running on port 3000
- [ ] Ganache running on port 7545

### Testing Checklist

- [ ] Can request nonce from backend
- [ ] Can sign message with MetaMask
- [ ] Can verify signature and get token
- [ ] Can use token for authenticated requests
- [ ] Can upload medical records with blockchain

---

## 🎉 CONGRATULATIONS!

You're now ready to use **MetaMask authentication** sa EHR Blockchain System!

**Key Points:**
- ✅ **No code changes needed** - backend is complete
- ✅ **Install MetaMask** - browser extension
- ✅ **Connect to Ganache** - local blockchain
- ✅ **Import accounts** - from Ganache
- ✅ **Test authentication** - nonce → sign → verify

**Next Steps:**
1. Test MetaMask login from frontend
2. Test medical record upload with MetaMask signing
3. Test access control with different wallet addresses

---

**Questions?** Check POSTMAN-TESTING-GUIDE.md for API testing examples!
