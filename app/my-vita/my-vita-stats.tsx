"use client";

import "@lottiefiles/lottie-player";
import { usePrivy } from "@privy-io/react-auth";

export default function MyVitaStats() {
  const { ready, authenticated, user, logout, ...privy } = usePrivy();

  if (!ready) {
    // TODO better loading UI, maybe improve with RSC, maybe Suspense
    return (
      <div className="flex h-full w-full items-center justify-center">
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="/vitadao-spinner.json"
          class="w-32"
        />
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
