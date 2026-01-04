# EHR Blockchain Backend

A blockchain-based Electronic Health Records (EHR) system backend built with Node.js, Express.js, TypeScript, and Prisma.

## Tech Stack

### Core Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM (MySQL)

### Blockchain Integration
- **Web3.js** - Ethereum JavaScript API
- **Ethers.js** - Ethereum wallet implementation and utilities
- **IPFS HTTP Client** - Decentralized file storage for medical records

### Security & Authentication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **CipherToken** - Triple-layer encryption (custom implementation)
- **API Key Middleware** - Encrypted API key validation

### Additional Features
- **Socket.io** - Real-time WebSocket communication
- **Redis** (ioredis) - Caching and rate limiting
- **Zod** - Schema validation
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## Installed Dependencies

### Production Dependencies
```json
{
  "@prisma/client": "^7.2.0",
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "ethers": "^6.16.0",
  "express": "^5.2.1",
  "ioredis": "^5.8.2",
  "ipfs-http-client": "^60.0.1",
  "jsonwebtoken": "^9.0.3",
  "morgan": "^1.10.1",
  "prisma": "^7.2.0",
  "socket.io": "^4.8.3",
  "web3": "^4.16.0",
  "zod": "^3.25.76"
}
```

### Development Dependencies
```json
{
  "@types/cors": "^2.8.19",
  "@types/express": "^5.0.6",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/morgan": "^1.9.10",
  "@types/node": "^25.0.3",
  "javascript-obfuscator": "^5.1.0",
  "nodemon": "^3.1.11",
  "rimraf": "^6.1.2",
  "ts-node": "^10.9.2",
  "tsconfig-paths": "^4.2.0",
  "typescript": "^5.9.3"
}
```

## Setup Instructions

### 1. Install Dependencies
All dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.dev` and update the values:

```bash
# Generate security keys
ts-node src/gen/genSecretToken.ts
ts-node src/gen/genApiKey.ts
ts-node src/gen/genApiKeySecret.ts
```

Update `.env.dev` with:
- Database connection URL
- Generated security keys
- Blockchain network configuration (Infura/Alchemy)
- IPFS configuration

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:db-push

# Or run migrations
npm run prisma:migrate

# Open Prisma Studio (optional)
npm run prisma:studio
```

### 4. Run Development Server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run build:production` - Build + obfuscate for production
- `npm run production` - Run production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:db-push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio GUI

## Blockchain Configuration

### Ethereum Network Setup
The system supports multiple Ethereum networks:
- **Development**: Sepolia testnet
- **Production**: Ethereum mainnet

Configure in `.env.dev`:
```env
BLOCKCHAIN_NETWORK=sepolia
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_smart_contract_address
```

### IPFS Setup
Medical records are stored on IPFS for decentralization:
```env
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

For production, use Infura IPFS or Pinata.

## Project Structure

```
src/
├── config/           # App configuration
├── db/              # Database connections (Prisma, Redis)
├── gen/             # Key generation utilities
├── lib/             # Core libraries & base classes
├── middleware/      # Express middleware
├── network/         # API routes & controllers
│   ├── controllers/ # Business logic
│   └── routes/      # Route definitions
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── index.ts         # Express app configuration
└── server.ts        # Server entry point
```

## Security Features

1. **Triple-Layer Encryption**: Custom CipherToken implementation
2. **API Key Validation**: Encrypted API keys for all requests
3. **JWT Authentication**: Secure user authentication
4. **Rate Limiting**: Redis-based request throttling
5. **Security Headers**: Helmet.js integration
6. **CORS Protection**: Configurable CORS policies

## Next Steps

1. ✅ Install all backend dependencies
2. ✅ Configure TypeScript and build tools
3. ✅ Set up Prisma ORM
4. ⏳ Configure blockchain smart contracts
5. ⏳ Set up IPFS integration
6. ⏳ Implement EHR-specific controllers
7. ⏳ Deploy and test

## Notes

- Prisma 7 uses a new configuration format (`prisma.config.ts`)
- IPFS HTTP Client is deprecated in favor of Helia (consider migrating)
- Make sure to run security key generators before first use
- Update blockchain configuration based on your network choice

## License
ISC
