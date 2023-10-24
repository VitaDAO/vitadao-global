"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";
import { useVitaBalance } from "@/lib/hooks";
import { cn, truncateWallet } from "@/lib/utils";

export default function MyVitaStats() {
  const router = useRouter();
  const { login } = useLogin({ onComplete: router.refresh });
  const { ready, authenticated, user, linkWallet, unlinkWallet } = usePrivy();
  const { data, isInitialLoading } = useVitaBalance(user);

  if (!ready || isInitialLoading) {
    // TODO better loading UI, maybe improve with RSC, maybe Suspense
    return (
      <div className="flex h-full w-full items-center justify-center py-[20px] @xl/main:py-[30px]">
        <VitadaoSpinner />
      </div>
    );
  }

  if (ready && !authenticated) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] py-[20px]  @xl/main:gap-[30px] @xl/main:py-[30px]">
        <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
          Please log in and link a wallet to view your balances.
        </p>
        <div className="flex justify-stretch gap-2">
          <Button
            intent="tertiary"
            onClick={login}
            className="px-[33px] text-base font-medium leading-none text-vita-purple"
          >
            Sign up
          </Button>
          <Button
            intent="tertiary"
            onClick={login}
            className="px-[33px] text-base font-medium leading-none text-vita-purple"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  // TODO map out and handle all necessary status values, i.e. status === "error"
  if (ready && authenticated && user && data) {
    const disabled = user.linkedAccounts.length <= 1;
    return (
      <>
        {data.balances.length > 0 ? (
          <div className="flex h-full w-full flex-col @container/card [&>div:first-child]:pb-[10px] [&>div]:py-[20px] @xl/main:[&>div]:py-[30px]">
            <div className="grid gap-y-[9px] text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060] @xl/card:grid-cols-[160px_1fr_max-content]">
              <span className="@xl/card:hidden">Linked wallets</span>
              <span className="hidden @xl/card:block">Linked wallet</span>
              <span className="hidden @xl/card:block">Balance</span>
              <span className="hidden @xl/card:block">Manage</span>
            </div>
            {data.balances.map((b) => (
              <div
                key={b.address}
                className="grid grid-cols-2 gap-y-[9px] border-b border-[#ECECEC] leading-none @xl/card:grid-cols-[160px_1fr_max-content]"
              >
                <span className="font-medium">{truncateWallet(b.address)}</span>
                <span className="text-right @xl/card:text-left">
                  {b.balance} VITA
                </span>
                <button
                  className={cn(
                    "text-left font-semibold text-vita-purple underline underline-offset-4 @xl/card:text-right",
                    disabled &&
                      "cursor-not-allowed font-normal text-gray-800 no-underline",
                  )}
                  onClick={disabled ? () => {} : () => unlinkWallet(b.address)}
                >
                  Unlink
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-y-[9px] border-b border-[#ECECEC] @xl/card:grid-cols-[160px_1fr_max-content] @xl/card:border-none @xl/card:pb-0">
              <span className="font-medium">Total VITA</span>
              <span className="text-right font-semibold @xl/card:text-left">
                {data.totalBalance} VITA
              </span>
              <button
                className="hidden font-semibold text-vita-purple underline underline-offset-4 @xl/card:block"
                onClick={linkWallet}
              >
                Link another wallet
              </button>
            </div>
            <div className="flex items-center justify-center @xl/card:hidden">
              <button
                className="font-semibold text-vita-purple underline underline-offset-4"
                onClick={linkWallet}
              >
                Link another wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] py-[20px] @xl/main:gap-[30px] @xl/main:py-[30px]">
            <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
              Please link a wallet to view your balances.
            </p>
            <Button
              intent="tertiary"
              className="px-[33px] text-base font-medium leading-none text-vita-purple"
              onClick={linkWallet}
            >
              Link a Wallet
            </Button>
          </div>
        )}
      </>
    );
  }
}
