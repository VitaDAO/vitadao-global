import "server-only";

import { unstable_cache } from "next/cache";
import { createPublicClient, formatUnits, http } from "viem";
import { gnosis, mainnet, optimism } from "viem/chains";
import { z } from "zod";

const ethereumClient = createPublicClient({
  chain: mainnet,
  name: "Ethereum Mainnet",
  transport: http(process.env.ETHEREUM_HTTP_RPC, {
    timeout: 5_000,
  }),
});

const optimismClient = createPublicClient({
  chain: optimism,
  name: "Optimism Mainnet",
  transport: http(process.env.OPTIMISM_HTTP_RPC, {
    timeout: 5_000,
  }),
});

const gnosisClient = createPublicClient({
  chain: gnosis,
  name: "Gnosis Mainnet",
  transport: http(process.env.GNOSIS_HTTP_RPC, {
    timeout: 5_000,
  }),
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

const VITA_ETHEREUM_ADDRESS = "0x81f8f0bb1cB2A06649E51913A151F0E7Ef6FA321";
const VITA_OPTIMISM_ADDRESS = "0x7d14206c937e70e19e3a5b94011faf0d5b3928e2";
const VITA_GNOSIS_ADDRESS = "0x0939a7c3f8D37C1ce67fAda4963aE7E0bd112ff3";
const VITA_DECIMALS = 18;

const walletAddressSchema = z.custom<`0x${string}`>((val) =>
  /^0x[a-fA-F0-9]{40}/.test(z.string().parse(val)),
);

const vitaBalanceSchema = z.tuple([
  z.union([z.literal("Ethereum"), z.literal("Optimism"), z.literal("Gnosis")]),
  walletAddressSchema,
  z.number(),
]);

export type VitaBalance = z.infer<typeof vitaBalanceSchema>;

const getVitaBalancesForSingleAddress = unstable_cache(
  async (address: string): Promise<VitaBalance[]> => {
    const parsedAddress = walletAddressSchema.parse(address);
    return Promise.all([
      ethereumClient.readContract({
        address: VITA_ETHEREUM_ADDRESS,
        abi,
        functionName: "balanceOf",
        args: [parsedAddress],
      }),
      optimismClient.readContract({
        address: VITA_OPTIMISM_ADDRESS,
        abi,
        functionName: "balanceOf",
        args: [parsedAddress],
      }),
      gnosisClient.readContract({
        address: VITA_GNOSIS_ADDRESS,
        abi,
        functionName: "balanceOf",
        args: [parsedAddress],
      }),
    ]).then(([ethereumBalance, optimismBalance, gnosisBalance]) => {
      return [
        [
          "Ethereum",
          parsedAddress,
          Number(formatUnits(ethereumBalance, VITA_DECIMALS)),
        ],
        [
          "Optimism",
          parsedAddress,
          Number(formatUnits(optimismBalance, VITA_DECIMALS)),
        ],
        [
          "Gnosis",
          parsedAddress,
          Number(formatUnits(gnosisBalance, VITA_DECIMALS)),
        ],
      ];
    });
  },
  ["getVitaBalancesForSingleAddress"],
  {
    revalidate: 180
  }
);

export async function getVitaBalances(addresses: string[]) {
  const balances: VitaBalance[] = [];

  for (const address of walletAddressSchema.array().parse(addresses)) {
    // TODO improve fetching parallelism, retries, etc.
    (await getVitaBalancesForSingleAddress(address)).forEach((balance) =>
      balances.push(balance),
    );
  }

  return balances;
}
