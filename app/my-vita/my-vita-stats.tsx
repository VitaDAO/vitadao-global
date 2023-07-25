"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";
import { useVitaBalance } from "@/lib/hooks";

export default function MyVitaStats() {
  const { ready, authenticated, user, linkWallet } = usePrivy();
  const { status, data } = useVitaBalance(user);

  if (!ready || status !== "success") {
    // TODO better loading UI, maybe improve with RSC, maybe Suspense
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VitadaoSpinner />
      </div>
    );
  }

  if (ready && !authenticated) {
    return <p>You need to log in</p>;
  }

  if (ready && authenticated && user && data) {
    return (
      <div className="space-y-3">
        <p>You have a total of:</p>
        <p className="ml-5 font-bold">{data.totalBalance} VITA</p>
        {data.balances.length > 0 ? (
          <>
            <p>Wallet breakdown:</p>
            <div className="ml-5">
              {data.balances.map((b) => (
                <p key={b.address}>
                  {b.address}: {b.balance} VITA
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <p>You have no linked wallets</p>
            <Button
              intent="tertiary"
              variant="thin"
              onClick={linkWallet}
              className="ml-5"
            >
              <span className="icon--vita icon--vita--wallet mr-2" />
              Link a wallet
            </Button>
          </>
        )}
      </div>
    );
  }
}
