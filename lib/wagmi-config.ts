import { createConfig, fallback, http, webSocket } from "wagmi";
import { mainnet } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet],
  ssr: true,
  transports: {
    [mainnet.id]: fallback([
      webSocket(
        `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
      ),
      http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
      ),
    ]),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
