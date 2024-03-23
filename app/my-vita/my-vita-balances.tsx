import { getCurrentUser } from "@/lib/user";
import { formatNumber, truncateWallet } from "@/lib/utils";
import { type VitaBalance } from "@/lib/vita";

import {
  LinkWalletButton,
  PleaseLinkWallet,
  PleaseLogIn,
  UnlinkWalletButton,
} from "./client-components";

export async function MyVitaBalances() {
  const user = await getCurrentUser();

  if (user) {
    const groupedVitaBalances = groupVitaBalancesByAddress(user.vitaBalances);

    if (groupedVitaBalances.size > 0 || user.vitaOffset !== 0) {
      return (
        <div className="flex h-full w-full flex-col @container/card">
          <div className="grid gap-y-[9px] pb-[10px] text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060] @xl/card:grid-cols-[160px_1fr_max-content]">
            <span className="@xl/card:hidden">Linked wallets</span>
            <span className="hidden @xl/card:block">Linked wallet</span>
            <span className="hidden @xl/card:block">Balance</span>
            <span className="hidden @xl/card:block">Manage</span>
          </div>
          <div className="overflow-y-auto">
            {Array.from(groupedVitaBalances).map(
              ([address, { chains, totalBalance }]) => (
                <div
                  key={address}
                  className="grid grid-cols-2 items-center gap-y-[9px] border-b border-[#ECECEC] py-[20px] leading-none @xl/card:grid-cols-[160px_1fr_max-content] @xl/main:py-[30px]"
                >
                  <span className="font-medium">{truncateWallet(address)}</span>
                  <span className="flex flex-row-reverse items-center gap-2 @xl/card:flex-row">
                    <span>{formatNumber(totalBalance)} VITA</span>
                    {chains.length > 0 && (
                      <span className="flex -space-x-1">
                        {chains.map((chain) => {
                          switch (chain) {
                            case "Ethereum":
                              return (
                                <span
                                  key={chain}
                                  className="inline-flex h-[1.1em] w-[1.1em] items-center justify-center rounded-full border border-black bg-white"
                                >
                                  <span className="icon--vita icon--vita--ethereum text-[0.7em]" />
                                </span>
                              );
                            case "Gnosis":
                              return (
                                <span
                                  key={chain}
                                  className="icon--logos--gnosis text-[0.9em]"
                                />
                              );
                            case "Optimism":
                              return (
                                <span
                                  key={chain}
                                  className="icon--logos--optimism text-[0.9em]"
                                />
                              );
                          }
                        })}
                      </span>
                    )}
                  </span>
                  <UnlinkWalletButton
                    address={address}
                    disabled={user.linkedAccounts.length <= 1}
                  />
                </div>
              ),
            )}
          </div>
          {user.vitaOffset !== 0 && (
            <div className="grid grid-cols-2 items-center border-b border-[#ECECEC] py-[20px] leading-none @xl/card:grid-cols-[160px_1fr_max-content] @xl/main:py-[30px]">
              <span className="font-medium">Manual offset</span>
              <span className="text-right @xl/card:text-left">
                {formatNumber(user.vitaOffset)} VITA
              </span>
              <span></span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-y-[9px] border-b border-[#ECECEC] py-[20px] @xl/card:grid-cols-[160px_1fr_max-content] @xl/card:border-none @xl/card:!pb-0 @xl/main:py-[30px]">
            <span className="font-medium">Total VITA</span>
            <span className="text-right font-semibold @xl/card:text-left">
              {formatNumber(user.totalVita)} VITA
            </span>
            <LinkWalletButton className="hidden @xl/card:block">
              Link another wallet
            </LinkWalletButton>
          </div>
          <div className="mt-[20px] flex items-center justify-center @xl/card:hidden @xl/main:mt-[30px]">
            <LinkWalletButton>Link another wallet</LinkWalletButton>
          </div>
        </div>
      );
    } else {
      return <PleaseLinkWallet />;
    }
  } else {
    return <PleaseLogIn />;
  }
}

function groupVitaBalancesByAddress(vitaBalances: VitaBalance[]) {
  type Acc = Map<
    string,
    {
      chains: Array<"Ethereum" | "Optimism" | "Gnosis">;
      totalBalance: number;
    }
  >;

  return vitaBalances.reduce<Acc>((acc, [chain, address, balance]) => {
    const entry = acc.get(address);

    if (entry && balance > 0) {
      acc.set(address, {
        chains: [...entry.chains, chain],
        totalBalance: entry.totalBalance + balance,
      });
    } else if (balance > 0) {
      acc.set(address, {
        chains: [chain],
        totalBalance: balance,
      });
    } else if (!entry) {
      acc.set(address, {
        chains: [],
        totalBalance: 0,
      });
    }

    return acc;
  }, new Map());
}
