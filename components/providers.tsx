"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

// TODO maybe reconsider wagmi vs @wagmi/core. I'm combining react-query and
// fetchBalance because useBalance only supports a single address and we want to
// aggregate multiple. Maybe we can skip the Wagmi provider if we're not going
// to end up using it.

// Wagmi
const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string })],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// react-query
const queryClient = new QueryClient();

// Component
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}>
          {children}
        </PrivyProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
