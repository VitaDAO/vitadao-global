// TODO I'm not super happy with the current module breakdown and I think it'd
// be better to go with a domain-split rather than a "technical" split. I.e. not
// having a kitchensink "hooks.ts" file but sprinkling hooks in domain specific
// modules. Will do for now.

import type { User, WalletWithMetadata } from "@privy-io/react-auth";
import { useQuery } from "react-query";
import { fetchBalance } from "wagmi/actions";
import { z } from "zod";

export function isWalletAccount(
  account: User["linkedAccounts"][number]
): account is WalletWithMetadata {
  return account.type === "wallet";
}

// TODO using this until Zod supports template literal types
// https://github.com/colinhacks/zod/issues/419#issuecomment-830729336. This is
// required to please wagmi's `0x${string}` wallet address type but we go a step
// further here and use Zod to enforce 40 char addresses, which I think is
// always the case, at least in our expected use of this.
export const WalletAddress = z.custom<`0x${string}`>((val) =>
  /^0x[a-fA-F0-9]{40}/.test(z.string().parse(val))
);

export async function getVitaBalance(user: User | null) {
  if (user === null) return null;

  const walletAddresses = user.linkedAccounts.filter(isWalletAccount);
  // TODO would be cool to find a light-weight way to limit concurrency, i.e.
  // not trigger more than X fetch requests in parallel. Effect might be cool
  // but maybe still early days.
  const balances = await Promise.all(
    walletAddresses.map(async ({ address }) => {
      const validAddress = WalletAddress.parse(address);
      return {
        address: validAddress,
        balance: await fetchBalance({
          address: validAddress,
          token: "0x81f8f0bb1cB2A06649E51913A151F0E7Ef6FA321",
        }).then((res) => Number(res.formatted)),
      };
    })
  );

  return {
    totalBalance: Number(balances.reduce((acc, cur) => acc + cur.balance, 0)),
    balances,
  };
}

export function useVitaBalance(user: User | null) {
  return useQuery(["useVitaBalance", user], () => getVitaBalance(user), {
    enabled: !!user,
  });
}
