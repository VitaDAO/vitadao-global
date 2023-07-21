"use client";

import { usePrivy } from "@privy-io/react-auth";

import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";

export default function MyVitaStats() {
  const { ready, authenticated, user, logout, ...privy } = usePrivy();

  if (!ready) {
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

  if (ready && authenticated && user) {
    return (
      <p>
        Great, you&apos;re logged in! We still need to implement the balance UI
      </p>
    );
  }
}
