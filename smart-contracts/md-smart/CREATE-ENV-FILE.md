# ⚠️ MISSING .env FILE!

**Error:** `Cannot read properties of undefined (reading 'address')`

**Cause:** No `.env` file with `BLOCKCHAIN_PRIVATE_KEY`

---

## 🔧 **FIX: Create .env file**

### **Step 1: Create the file**

**In PowerShell:**
```powershell
cd D:\CAPSTONE\ehr-blockchain\smart-contracts

# Create .env file
New-Item -Path .env -ItemType File -Force
```

### **Step 2: Add content**

**Open:** `smart-contracts/.env`

**Paste this:**
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

### **Step 3: Verify file exists**

```powershell
Get-Content .env
```

**Should show:**
```
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

### **Step 4: Deploy again**

```powershell
npm run deploy:ganache
```

---

## ✅ **OR USE THIS ONE-LINER:**

```powershell
@"
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
"@ | Out-File -FilePath .env -Encoding utf8
```

Then run:
```powershell
npm run deploy:ganache
```

---

## 🎯 **YOUR GANACHE CREDENTIALS:**

```
Account (0): 0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9
Private Key: 0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
Chain ID: 1337
```

**This will fix the error!** ✅

