"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { config } from "@/lib/wagmi-config";

// TODO maybe reconsider wagmi vs just using viem. I'm combining react-query and
// fetchBalance because useBalance only supports a single address and we want to
// aggregate multiple. Maybe we can skip the Wagmi provider if we're not going
// to end up using it.

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}>
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
