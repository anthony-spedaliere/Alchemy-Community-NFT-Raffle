import { createPublicClient, createWalletClient, custom, http} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

declare global {
  interface Window {
    ethereum?: any;
  }
}
 
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
})

// Wallet client creation (client-side only)
let walletClientInstance: any = null;
export const getWalletClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet client is only available on the client side');
  }
  if (!walletClientInstance) {
    walletClientInstance = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)
    });
  }
  return walletClientInstance;
};

// JSON-RPC Account
export const getAccount = async () => {
  const walletClient = getWalletClient();
  const addresses = await walletClient.getAddresses();
  return addresses[0];
}