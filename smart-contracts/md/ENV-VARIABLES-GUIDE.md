# 🔐 ENVIRONMENT VARIABLES - Consistent Names

**Updated to match your backend .env.dev!** ✅

---

## 📋 **USE THESE VARIABLE NAMES**

### **For smart-contracts/.env:**

```env
# Use the SAME names as backend for consistency!
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

### **For ehr-backend/.env.dev:**

```env
# Same variable names!
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7

# Plus your contract address (after deployment)
EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## ✅ **CONSISTENT NAMING**

| Variable | Smart Contracts | Backend | Same? |
|----------|----------------|---------|-------|
| RPC URL | `BLOCKCHAIN_RPC_URL` | `BLOCKCHAIN_RPC_URL` | ✅ Yes |
| Chain ID | `BLOCKCHAIN_CHAIN_ID` | `BLOCKCHAIN_CHAIN_ID` | ✅ Yes |
| Private Key | `BLOCKCHAIN_PRIVATE_KEY` | `BLOCKCHAIN_PRIVATE_KEY` | ✅ Yes |

**Why same names?**
- ✅ Less confusion
- ✅ Easy to remember
- ✅ Can share between projects
- ✅ Professional practice

---

## 🎯 **YOUR GANACHE INFO**

**Account (0):**
```
Address: 0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9
Private Key: 0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
Balance: 100 ETH
Network ID: 5777
```

---

## 📝 **QUICK SETUP**

### **Step 1: Create smart-contracts/.env**

```bash
cd smart-contracts
notepad .env
```

**Paste:**
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

### **Step 2: Deploy**

```bash
npm install
npm run compile
npm run deploy:ganache
```

### **Step 3: Add Contract Address to Backend**

Update `ehr-backend/.env.dev`:

```env
# Add this line with your deployed contract address
EHR_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## ✅ **VERIFICATION**

Both files should have:

**smart-contracts/.env:**
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

**ehr-backend/.env.dev:**
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=5777
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
EHR_CONTRACT_ADDRESS=0x5FbDB...  # After deployment
```

**Same variables = Easy to manage!** ✅

---

## 🚀 **READY TO DEPLOY!**

**Your setup is correct with `BLOCKCHAIN_PRIVATE_KEY`!**

Just create the .env file and deploy! 💪

