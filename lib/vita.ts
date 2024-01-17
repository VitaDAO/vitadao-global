import { createPublicClient, formatUnits, http } from "viem";
import { mainnet } from "viem/chains";
import { z } from "zod";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  ),
});

const abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const vitaAddress = "0x81f8f0bb1cB2A06649E51913A151F0E7Ef6FA321";
const vitaDecimals = 18;

const WalletAddress = z.custom<`0x${string}`>((val) =>
  /^0x[a-fA-F0-9]{40}/.test(z.string().parse(val)),
);

const VitaBalance = z.object({
  addresses: z.record(z.number()),
  total: z.number(),
});

type VitaBalance = z.infer<typeof VitaBalance>;

export async function getWalletsBalance(addresses: Array<string>) {
  const balance: VitaBalance = {
    addresses: {},
    total: 0,
  };

  // TODO improve this with a bit of concurrency and retries. Effect, looking at you 👀
  for (const address of addresses) {
    const addressBalance = Number(
      formatUnits(
        await publicClient.readContract({
          address: vitaAddress,
          abi: abi,
          functionName: "balanceOf",
          args: [WalletAddress.parse(address)],
        }),
        vitaDecimals,
      ),
    );

    balance.total += addressBalance;
    balance.addresses[address] = addressBalance;
  }

  return balance.total;
}
