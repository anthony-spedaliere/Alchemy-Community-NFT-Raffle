# Alchemy Community NFT Raffle

A decentralized raffle system built on Ethereum using Chainlink Functions and VRF for fair random winner selection. This project integrates with external APIs to fetch NFT ownership data and determine raffle entries based on NFT holdings.

## Features

- **Decentralized Raffle System**: Smart contract-based raffle with on-chain randomness
- **NFT-Based Entries**: Entries calculated based on Alchemy Community NFT ownership
- **Chainlink Integration**: Uses Chainlink Functions for API calls and VRF for randomness
- **Admin Dashboard**: Web interface for administrators to manage raffles
- **Commitment Hash Verification**: Ensures raffle integrity with cryptographic commitments
- **Modern Frontend**: Built with Next.js, React, and Tailwind CSS

## Tech Stack

### Smart Contracts
- **Solidity**: ^0.8.19
- **Foundry**: For Smart Contract development
- **Chainlink Functions**: For external API calls
- **Chainlink VRF**: For verifiable randomness

### Frontend
- **Next.js**: 16.0.1 (React framework)
- **React**: 19.2.0
- **TypeScript**: For type safety
- **RainbowKit**: Wallet connection UI
- **Wagmi**: Ethereum interactions
- **Tailwind CSS**: Styling

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **Foundry**: Ethereum development toolkit
- **Git**: For cloning the repository
- **Alchemy API Key**: For NFT data fetching
- **Ethereum Wallet**: With Sepolia testnet ETH

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leetebbs/Alchemy-Community-NFT-Raffle.git
   cd Alchemy-Community-NFT-Raffle
   ```

2. **Install contract dependencies:**
   ```bash
   cd contracts
   forge install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Setup

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Alchemy API Key for NFT data
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Deployed contract address
CONTRACT_ADDRESS=your_deployed_contract_address

# Admin wallet address (lowercase)
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_wallet_address

# Optional: Chainlink subscription IDs (for reference)
FUNCTIONS_SUBSCRIPTION_ID=your_functions_subscription_id
VRF_SUBSCRIPTION_ID=your_vrf_subscription_id
```

### Contract Environment Variables

For deployment scripts, you'll need:

- Private key for deployment
- RPC URL (e.g., Sepolia Infura/Alchemy)
- Chainlink subscription IDs

## Chainlink Setup (Admin Required)

### 1. Create Chainlink Functions Subscription

1. Go to [Chainlink Functions](https://functions.chain.link/)
2. Connect your wallet
3. Create a new subscription
4. Fund the subscription with LINK tokens (on Sepolia testnet)
5. Note the subscription ID

### 2. Create Chainlink VRF Subscription

1. Go to [Chainlink VRF](https://vrf.chain.link/)
2. Connect your wallet
3. Create a new subscription
4. Fund with LINK tokens
5. Note the subscription ID

### 3. Configure VRF Consumer

- Use the VRF v2.5 consumer
- For Sepolia testnet:
  - Key Hash: `0x787d74caea10b2b357790d5b5247c2f63d1d91572`
  - Gas Limit: 800,000
  - Confirmations: 3

## Contract Deployment (Admin)

1. **Navigate to contracts directory:**
   ```bash
   cd contracts
   ```

2. **Create deployment script** (if not exists):
   Create `script/Deploy.s.sol`:
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.19;

   import {Script} from "forge-std/Script.sol";
   import {AlchemyRaffle} from "../src/AlchemyRaffle.sol";

   contract DeployScript is Script {
       function run() external {
           uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
           vm.startBroadcast(deployerPrivateKey);

           // Deploy contract with your subscription IDs
           AlchemyRaffle raffle = new AlchemyRaffle(
               0x649a2C205BE7A3d5e99206CEEFF30c794f0E31dD, // router address
               vm.envUint("FUNCTIONS_SUBSCRIPTION_ID"),
               vm.envBytes32("FUNCTIONS_DON_ID"),
               vm.envUint("VRF_SUBSCRIPTION_ID"),
               vm.envBytes32("VRF_KEY_HASH")
           );

           vm.stopBroadcast();
       }
   }
   ```

3. **Set environment variables for deployment:**
   ```bash
   export PRIVATE_KEY=your_private_key_without_0x
   export FUNCTIONS_SUBSCRIPTION_ID=your_functions_subscription_id
   export FUNCTIONS_DON_ID=0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000
   export VRF_SUBSCRIPTION_ID=your_vrf_subscription_id
   export VRF_KEY_HASH=0x787d74caea10b2b357790d5b5247c2f63d1d91572
   ```

4. **Deploy to Sepolia:**
   ```bash
   forge script script/Deploy.s.sol --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY --broadcast --verify
   ```

5. **Note the deployed contract address** and update your `.env.local` file.

## Running the Application

### Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### Contract Testing

```bash
cd contracts
forge test
```

### Contract Building

```bash
cd contracts
forge build
```

## Admin Guide

### Accessing Admin Dashboard

1. Navigate to `http://localhost:3000/admin` (or deployed URL)
2. Connect your wallet using the "Connect Wallet" button
3. Ensure your wallet address matches `NEXT_PUBLIC_ADMIN_ADDRESS`

### Starting a Raffle

1. **Enter NFT IDs**: Comma-separated list of eligible NFT token IDs (e.g., "137,138,139")
2. **Optional Month**: Specify a month for themed raffles
3. **Fetch Entries**: Click to preview total entries and commitment hash
4. **Start Raffle**: Initiate the raffle process on-chain

### Raffle Process

1. **Entry Calculation**: Chainlink Functions fetches NFT ownership data
2. **Commitment Hash**: Generated for raffle integrity
3. **Random Selection**: VRF provides randomness for winner selection
4. **Winner Announcement**: Winner address revealed on-chain

### Monitoring Raffles

- View raffle history and status
- Check pending requests and errors
- Verify commitment hashes for transparency

## API Endpoints

### `/api/FetchNumberOfEntries`
- **Method**: POST
- **Purpose**: Calculate total raffle entries based on NFT ownership
- **Parameters**:
  - `nftIds`: Array of NFT token IDs
  - `shuffle`: Boolean for randomizing entries
  - `includeEntries`: Boolean to return entry list

### `/api/FetchWinnerAddress`
- **Method**: GET
- **Purpose**: Retrieve winner address for a raffle
- **Parameters**: Raffle ID

### `/api/VerifyCommitmentHash`
- **Method**: POST
- **Purpose**: Verify raffle integrity
- **Parameters**: Commitment hash and raffle data

## Project Structure

```
alch-raffle-demo-v3/
├── contracts/                 # Foundry project
│   ├── src/
│   │   └── AlchemyRaffle.sol  # Main contract
│   ├── lib/                   # Dependencies
│   ├── test/                  # Contract tests
│   └── foundry.toml          # Foundry config
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboard
│   │   └── components/        # React components
│   ├── lib/                   # Utilities
│   └── package.json
└── README.md                  # This file
```

## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Keep API keys and sensitive data in environment files
- **Admin Access**: Restrict admin functions to authorized addresses
- **Chainlink Subscriptions**: Monitor subscription balances
- **Contract Verification**: Verify contracts on Etherscan for transparency

## Troubleshooting

### Common Issues

1. **Chainlink Functions Timeout**: Increase gas limit or check subscription balance
2. **VRF Request Failure**: Verify subscription ID and funding
3. **API Rate Limits**: Monitor Alchemy API usage
4. **Wallet Connection Issues**: Ensure MetaMask is connected to Sepolia

### Debug Tools

- Use `forge test` for contract testing
- Check contract events on Etherscan
- Monitor Chainlink subscription dashboards
- Use browser dev tools for frontend debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue on GitHub
- Check the Chainlink documentation
- Review Foundry documentation</content>
<filePath">/home/tebbo/alch-raffle-demo-v3/README.md