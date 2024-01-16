import Link from "next/link";
import "server-only";
import { z } from "zod";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn, formatNumber } from "@/lib/utils";

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
    const treasuryVitaUrl = z
      .string()
      .catch("https://api.bio.xyz/v1/token/vita")
      .parse(process.env.TREASURY_VITA_URL);

    const vitaStats = vitaStatsSchema.parse(
      await fetch(treasuryVitaUrl, {
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

interface VitaStatsCardProps extends React.ComponentPropsWithoutRef<"div"> {
  showMyVitaLink?: boolean;
  showTreasuryLink?: boolean;
}

export async function VitaStatsCard({
  className,
  showMyVitaLink = true,
  showTreasuryLink = true,
  ...rest
}: VitaStatsCardProps) {
  const vitaStats = await fetchVitaSats();

  if (vitaStats) {
    return (
      <div
        className={cn(
          "flex flex-wrap gap-x-[30px] gap-y-[20px] rounded-xl bg-white p-[30px] @container/card",
          className,
        )}
        {...rest}
      >
        <div>
          <p className="pb-[20px] text-sm uppercase leading-[16.8px] tracking-[0.56px] text-[#606060]">
            VITA at a glance
          </p>
          <div className="flex flex-col flex-wrap justify-between gap-x-[30px] gap-y-[20px] @xl/card:flex-row @4xl/card:gap-x-[60px]">
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
          </div>
        </div>
        <div className="flex flex-grow flex-col items-end justify-around gap-[16px] self-end text-right">
          {showMyVitaLink && (
            <Link
              href="/my-vita"
              className="text-base font-semibold text-vita-purple underline underline-offset-4"
            >
              My VITA
              <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
            </Link>
          )}
          {showTreasuryLink && (
            <Link
              href="/treasury"
              className="text-base font-semibold text-vita-purple underline underline-offset-4"
            >
              View the Treasury
              <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
            </Link>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-base font-semibold text-vita-purple underline underline-offset-4">
                How are these calculated?
                <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-3">
                <p className="text-lg font-semibold">
                  How we calculate VITA stats
                </p>
                <p>
                  The <b>price</b> of VITA is derived from the latest DEX swaps.
                </p>
                <p>
                  The <b>circulating supply</b> is computed as the total token
                  supply minus some stores of non-circulating VITA that have to
                  be maintained manually.
                </p>
                <p>
                  The <b>market cap</b> is the product of the price times the
                  circulating supply.
                </p>
                <p>
                  The underlying data used to determine these figures is fetched
                  from Transpose and updated every 5 minutes.
                </p>
                <div>
                  <p>
                    <a
                      href="https://www.coingecko.com/en/coins/vitadao"
                      target="_blank"
                      className="text-vita-purple underline underline-offset-4"
                    >
                      VITA on CoinGecko
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://coinmarketcap.com/currencies/vitadao/"
                      target="_blank"
                      className="text-vita-purple underline underline-offset-4"
                    >
                      VITA on CoinMarketCap
                    </a>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return null;
}
