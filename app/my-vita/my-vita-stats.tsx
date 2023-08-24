"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";
import { useVitaBalance } from "@/lib/hooks";
import { cn, truncateWallet } from "@/lib/utils";

export default function MyVitaStats() {
  const { ready, authenticated, user, linkWallet, login, unlinkWallet } =
    usePrivy();
  const { status, data } = useVitaBalance(user);

  if (!ready || status === "loading") {
    // TODO better loading UI, maybe improve with RSC, maybe Suspense
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VitadaoSpinner />
      </div>
    );
  }

  if (ready && !authenticated) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] @xl:gap-[30px]">
        <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
          Please log in and connect a wallet to view your balances.
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
          <div className="flex h-full w-full flex-col">
            <div className="grid grid-cols-2 gap-y-3 pb-[18px] text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060] @lg:grid-cols-[160px_1fr_max-content]">
              <span>Linked wallet</span>
              <span>Balance</span>
              <span>Manage</span>
            </div>
            {data.balances.map((b) => (
              <div
                key={b.address}
                className="grid grid-cols-2 gap-y-3 border-b border-[#ECECEC] py-[30px] @lg:grid-cols-[160px_1fr_max-content]"
              >
                <span className="font-medium">{truncateWallet(b.address)}</span>
                <span>{b.balance} VITA</span>
                <button
                  className={cn(
                    "font-semibold text-vita-purple underline underline-offset-4",
                    disabled &&
                      "cursor-not-allowed font-normal text-gray-800 no-underline",
                  )}
                  onClick={disabled ? () => {} : () => unlinkWallet(b.address)}
                >
                  Disconnect
                </button>
              </div>
            ))}
            <div className="flex flex-grow items-end justify-end pt-[30px] text-base leading-none">
              <button
                className="text-vita-purple underline underline-offset-4"
                onClick={linkWallet}
              >
                Connect another wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] @xl:gap-[30px]">
            <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
              Please connect a wallet to view your balances.
            </p>
            <Button
              intent="tertiary"
              className="px-[33px] text-base font-medium leading-none text-vita-purple"
              onClick={linkWallet}
            >
              Connect a Wallet
            </Button>
          </div>
        )}
      </>
    );
  }
}
