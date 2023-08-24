import Link from "next/link";
import "server-only";
import { z } from "zod";

import { formatNumber } from "@/lib/utils";

const vitaStatsSchema = z.object({
  status: z.literal("success"),
  results: z
    .array(
      z.object({
        circulating: z.number(),
        market_cap: z.number(),
        price: z.number(),
      }),
    )
    .nonempty(),
});

async function fetchVitaSats() {
  try {
    const vitaStats = vitaStatsSchema.parse(
      await fetch("https://api.bio.xyz/v1/token/vita", {
        next: { revalidate: 60 },
      }).then((res) => res.json()),
    );
    return vitaStats.results[0];
  } catch {
    // TODO we catch to avoid nuking the render even if the fetch of VITA stats
    // fails, we should probably log the error with Sentry or something, though.
    // Maybe there's even a better way to catch the error with suspense or error
    // boundary, I'll have to find out.
    return null;
  }
}

export async function VitaStatsCard() {
  const vitaStats = await fetchVitaSats();

  if (vitaStats) {
    return (
      <div className="rounded-xl bg-white p-[20px] md:p-[30px]">
        <p className="pb-[20px] text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060]">
          VITA at a glance
        </p>
        <div className="flex flex-wrap justify-between gap-x-[60px] gap-y-[20px]">
          <div>
            <p className="mb-[9px] text-h2 font-medium leading-[44px]">
              <span className="mr-1 text-lg">$</span>
              {formatNumber(vitaStats.price)}
            </p>
            <p className="text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060]">
              Token Price
            </p>
          </div>
          <div>
            <p className="mb-[9px] text-h2 font-medium leading-[44px]">
              {formatNumber(vitaStats.circulating)}
            </p>
            <p className="text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060]">
              Circulating Supply
            </p>
          </div>
          <div>
            <p className="mb-[9px] text-h2 font-medium leading-[44px]">
              <span className="mr-1 text-lg">$</span>
              {formatNumber(vitaStats.market_cap)}
            </p>
            <p className="text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060]">
              Market Cap
            </p>
          </div>
          <div className="flex flex-grow flex-col items-end justify-around space-y-[16px] self-end text-right">
            <p>
              <Link
                href="/my-vita"
                className="text-base font-medium text-vita-purple underline underline-offset-4"
              >
                My VITA
                <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
              </Link>
            </p>
            <p>
              <Link
                href="/treasury"
                className="text-base font-medium text-vita-purple underline underline-offset-4"
              >
                View the Treasury
                <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
