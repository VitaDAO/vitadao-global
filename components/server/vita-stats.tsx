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
      })
    )
    .nonempty(),
});

async function fetchVitaSats() {
  try {
    const vitaStats = vitaStatsSchema.parse(
      await fetch("https://api.bio.xyz/v1/token/vita").then((res) => res.json())
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
      <div className="flex flex-wrap justify-between gap-5 rounded-xl bg-white p-8">
        <div>
          <p className="text-h2 font-semibold">
            <span className="mr-1 text-lg">$</span>
            {formatNumber(vitaStats.price)}
          </p>
          <p className="uppercase">Token Price</p>
        </div>
        <div>
          <p className="text-h2 font-semibold">
            {formatNumber(vitaStats.circulating)}
          </p>
          <p className="uppercase">Circulating Supply</p>
        </div>
        <div>
          <p className="text-h2 font-semibold">
            <span className="mr-1 text-lg">$</span>
            {formatNumber(vitaStats.market_cap)}
          </p>
          <p className="uppercase">Market Cap</p>
        </div>
        <div className="flex flex-col justify-around text-right">
          <p>
            <Link href="/my-vita" className="underline underline-offset-4">
              My VITA &gt;
            </Link>
          </p>
          <p>
            <Link href="/treasury" className="underline underline-offset-4">
              View the Treasury &gt;
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
