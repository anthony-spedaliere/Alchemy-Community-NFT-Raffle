import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';

const contractABI = [
  {
    inputs: [],
    name: 'raffleCounter',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'uint256' }],
    name: 'getWinnerByRaffleId',
    outputs: [
      { type: 'address' },
      { type: 'uint256' },
      { type: 'string' },
      { type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function GET() {
  const rpcUrl = process.env.ALCHEMY_RAFFLE_RPC_URL;
  const contractAddress = process.env.NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS as `0x${string}`;

  if (!rpcUrl || !contractAddress) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  const client = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const contract = getContract({
    address: contractAddress,
    abi: contractABI,
    client,
  });

  try {
    const counter = await contract.read.raffleCounter();
    const winners = [];

    for (let i = 1; i <= Number(counter); i++) {
      const [winnerAddress, winnerIndex, month, hasWinner] = await contract.read.getWinnerByRaffleId([BigInt(i)]);

      if (hasWinner && winnerAddress !== '0x0000000000000000000000000000000000000000') {
        winners.push({
          raffleId: i,
          winnerAddress,
          winnerIndex: Number(winnerIndex),
          month,
        });
      }
    }

    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching past winners:', error);
    return NextResponse.json({ error: 'Failed to fetch past winners' }, { status: 500 });
  }
}