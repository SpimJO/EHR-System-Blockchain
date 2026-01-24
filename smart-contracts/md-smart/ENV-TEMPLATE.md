# 📄 .ENV FILE TEMPLATE

**Create this file:** `smart-contracts/.env`

---

## 🔐 **YOUR .ENV FILE CONTENT:**

```env
# Ganache Configuration
GANACHE_RPC_URL=http://127.0.0.1:7545
GANACHE_CHAIN_ID=5777
GANACHE_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7

# Ganache Account (0) Info:
# Address: 0x95221A341576D1e747EA6Fa3Bb8274A78C41D6f9
# Balance: 100 ETH
```

---

## 📋 **HOW TO CREATE:**

### **Method 1: Copy-Paste**

```bash
cd D:\CAPSTONE\ehr-blockchain\smart-contracts

# Create .env file and paste content above
notepad .env
```

### **Method 2: Command Line**

```bash
cd smart-contracts

# Windows (Command Prompt)
echo GANACHE_RPC_URL=http://127.0.0.1:7545 > .env
echo GANACHE_CHAIN_ID=5777 >> .env
echo GANACHE_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7 >> .env

# Windows (PowerShell)
@"
GANACHE_RPC_URL=http://127.0.0.1:7545
GANACHE_CHAIN_ID=5777
GANACHE_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
"@ | Out-File -FilePath .env -Encoding utf8
```

---

## ✅ **VERIFY .ENV FILE**

```bash
# Check if file exists
dir .env

# View content (optional)
type .env
```

**Should show:**
```
GANACHE_RPC_URL=http://127.0.0.1:7545
GANACHE_CHAIN_ID=5777
GANACHE_PRIVATE_KEY=0xf23190b1c4bf7f66c40b4997f65b2955e2cded1b0068ef1dfa5acad3b6349ae7
```

---

## 🚀 **THEN DEPLOY:**

```bash
npm install --save-dev dotenv
npm run compile
npm run deploy:ganache
```

**✅ Ready to go!**

