import { VitaStatsCard } from "@/components/server/vita-stats";
import MyVitaStats from "./my-vita-stats";

export default function Page() {
  return (
    <div className="mx-auto max-w-[1260px] @container">
      <div className="px-[20px] py-[30px] @xl:px-[30px] @xl:pt-[90px]">
        <h1 className="mb-[30px] text-h2 font-medium">My VITA</h1>
        <div className="mb-[20px] grid gap-[20px] @xl:mb-[30px] @xl:gap-[30px] @3xl:grid-cols-3">
          <div className="rounded-xl bg-white p-[20px] @xl:p-[30px] @3xl:col-span-2">
            <MyVitaStats />
          </div>
          <div className="space-y-5 rounded-xl bg-white p-[20px] @xl:p-[30px]">
            <p className="text-lg font-medium">Buy more VITA</p>
            <p>
              We recommend using CoW Swap or Uniswap to buy VITA for ease of use
              and security.
            </p>
            <div className="flex flex-col gap-5">
              <a
                href="https://cowswap.exchange/#/swap?referral=0xF5307a74d1550739ef81c6488DC5C7a6a53e5Ac2&inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#042B64] px-3 py-2 text-center text-[#CAE9FE]"
              >
                <span className="icon--vita icon--vita--cow-swap mr-2 text-lg" />
                CoW Swap
              </a>
              <a
                href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#FF007A] px-3 py-2 text-center text-white"
              >
                <span className="icon--vita icon--vita--uniswap mr-2 text-lg" />
                Uniswap
              </a>
            </div>
          </div>
        </div>
        <VitaStatsCard className="p-[20px] @xl:p-[30px]" />
      </div>
    </div>
  );
}
