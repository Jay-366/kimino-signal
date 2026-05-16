import { createPublicClient, http, defineChain } from 'viem';

// Setup Monad Testnet for viem
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
});

// Minimal ABI required to call `tokenURI`
const contractAbi = [
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export async function fetchCharacterMetadata(contractAddress: `0x${string}`, tokenId: string | number) {
  // Initialize public client (high-speed, secure, toll-free phone line to Monad)
  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  try {
    // Step 1: Read Contract - Retrieve IPFS pointer from Monad blockchain
    const rawUri = await publicClient.readContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    // Step 2 & 4: Protocol String Replacement (turning raw coordinate into navigable highway)
    let fetchUrl = rawUri;
    if (rawUri.startsWith('ipfs://')) {
      fetchUrl = rawUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }

    // Step 3: Fetch with revalidate - Server-side cache for 3600 seconds (1 hour)
    const response = await fetch(fetchUrl, {
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
    
  } catch (error) {
    console.error("Error fetching character:", error);
    return null;
  }
}
