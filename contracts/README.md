
### Deploy

Before deploying, make sure you have:

1. Created a `.env` file with the required environment variables (see `.env.example`)
2. Set up Chainlink VRF and Functions subscriptions on your target network
3. Funded your wallet with the network's native tokens
4. **Verified the latest Chainlink configurations** (they can change over time)
5. Planned to re-authorize the deployed contract address on both subscriptions (see Post-Deployment Checklist)

#### Supported Networks

- `sepolia` - Ethereum Sepolia testnet
- `mainnet` - Ethereum mainnet
- `amoy` - Polygon Amoy testnet
- `arbitrum-sepolia` - Arbitrum Sepolia testnet
- `optimism-sepolia` - Optimism Sepolia testnet
- `base-sepolia` - Base Sepolia testnet

#### Deployment Commands

```shell
# Deploy to Sepolia (default)
$ forge script script/DeployAlchemyRaffle.s.sol:DeployAlchemyRaffle --rpc-url sepolia --private-key $PRIVATE_KEY --broadcast --verify

# Deploy to Mainnet
$ forge script script/DeployAlchemyRaffle.s.sol:DeployAlchemyRaffle --rpc-url mainnet --private-key $PRIVATE_KEY --broadcast --verify

# Deploy to Polygon Amoy
$ forge script script/DeployAlchemyRaffle.s.sol:DeployAlchemyRaffle --rpc-url amoy --private-key $PRIVATE_KEY --broadcast --verify

# Deploy to Arbitrum Sepolia
$ forge script script/DeployAlchemyRaffle.s.sol:DeployAlchemyRaffle --rpc-url arbitrum-sepolia --private-key $PRIVATE_KEY --broadcast --verify

# For test deployment (no verification)
$ forge script script/DeployAlchemyRaffle.s.sol:DeployAlchemyRaffle --rpc-url sepolia --private-key $PRIVATE_KEY --broadcast
```

#### Post-Deployment Checklist

- Add the newly deployed contract address as a **consumer** on your Chainlink Functions subscription (https://functions.chain.link/)
- Add the same address as a **consumer** on your Chainlink VRF v2.5 subscription (https://vrf.chain.link/)
- Update your frontend `.env` (`NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS`, etc.) with the new contract address
- Re-run any seeding or admin setup scripts that rely on the contract address

### Environment Setup

Copy `.env.example` to `.env` and fill in the required values:

- `PRIVATE_KEY`: Your deployer wallet private key
- `VRF_SUBSCRIPTION_ID`: Chainlink VRF subscription ID for your target network
- `FUNCTIONS_SUBSCRIPTION_ID`: Chainlink Functions subscription ID for your target network
- `NETWORK`: Target network (sepolia, mainnet, amoy, arbitrum-sepolia, optimism-sepolia, base-sepolia)
- `*_RPC_URL`: RPC URLs for different networks (use Alchemy, Infura, etc.)
- `*_API_KEY`: Block explorer API keys for contract verification

