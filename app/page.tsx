import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { Marquee } from "@/components/ui/marquee";
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
    // TODO we catch to render the home even if the fetch of VITA stats fails,
    // we should probably log the error with Sentry or something, though.
    return null;
  }
}

export default async function Page() {
  const vitaStats = await fetchVitaSats();
  return (
    <div className="space-y-5">
      <div>
        <div className="bg-black bg-[center_right_-200px] px-5 py-5 pb-16 text-white @4xl:bg-[center_right_-50px] md:rounded-xl md:bg-[url('/fresh-3d-bg.jpg')] md:bg-[length:auto_100%] md:bg-no-repeat md:py-10 md:pb-10">
          <div className="space-y-5 text-center md:max-w-sm md:text-left">
            <div className="h-52 rounded-xl [background:linear-gradient(0deg,rgba(98,86,236,0.26)_0%,rgba(98,86,236,0.26)_100%),url(/fresh-3d-bg.jpg)center/cover_no-repeat,lightgray_50%/cover_no-repeat] md:hidden" />
            <h1 className="text-h3 font-semibold">Welcome to VitaDAO.Global</h1>
            <p>
              The new home for VitaDAO members, providing exclusive services,
              portfolio management and governance tools to VITA holders.
            </p>
            <p className="hidden text-sm md:block">
              <span className="rounded-md bg-vita-purple px-2 py-1">
                Under construction. Stay tuned for updates!
              </span>
            </p>
          </div>
        </div>
        <Marquee
          label=" UNDER CONSTRUCTION – STAY TUNED FOR UPDATES! –"
          className="bg-vita-purple py-1 text-sm text-white md:hidden"
        />
      </div>
      <div className="space-y-5 px-4 md:p-0">
        <div className="grid grid-cols-1 gap-5 overflow-clip rounded-xl bg-white @2xl:grid-cols-2">
          <div className="flex flex-col gap-5 p-5">
            <p className="uppercase">Featured service</p>
            <p className="text-h2">Wonderful Stays Logo</p>
            <h2 className="text-h4">
              Dolor laborum occaecat sint et duis adipisicing ex aute.
            </h2>
            <p className="flex-grow">
              Proident laboris cillum cillum incididunt voluptate exercitation
              eiusmod laborum occaecat labore. Elit ut sit sint culpa. Minim
              proident adipisicing dolore in mollit non proident ea officia.
            </p>
            <p>
              <Link
                href="/my-services/wonderful-stays"
                className="text-vita-purple underline"
              >
                View this service
              </Link>
            </p>
          </div>
          <Image
            src="/my-services/landscape.jpg"
            height={640}
            width={427}
            alt=""
            className="row-start-1 h-full max-h-60 w-full object-cover @2xl:col-start-2 @2xl:max-h-none"
          />
        </div>
        {vitaStats && (
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
        )}
      </div>
      <div className="flex justify-between px-5 md:px-0">
        <p className="uppercase">Recent Proposals</p>
        <p>
          <Link href="/proposals" className="underline underline-offset-4">
            View All &gt;
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 px-5 @2xl:grid-cols-3 md:px-0">
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-white">
          Placeholder
        </div>
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-white">
          Placeholder
        </div>
        <div className="flex h-[200px] items-center justify-center rounded-xl bg-white">
          Placeholder
        </div>
      </div>
    </div>
  );
}
