import Link from "next/link";

import { Proposals } from "@/components/server/proposals";
import { VitaStatsCard } from "@/components/server/vita-stats";
import { getFeaturedService } from "@/lib/services";
import { ServiceCard } from "./my-services/page";

export default async function Page() {
  const featuredService = await getFeaturedService();

  return (
    <div className="mx-auto max-w-[1260px] @container">
      <div className="space-y-[20px] px-[20px] py-[30px] @xl:space-y-[30px] @xl:px-[30px]">
        <div className="flex min-h-[220px] flex-col overflow-clip rounded-xl bg-black text-white @xl:flex-row">
          <div className="h-[240px] [background:url(/fresh-3d-bg.jpg)left/cover_no-repeat,lightgray_50%/cover_no-repeat] @xl:hidden" />
          <div className="flex-1 p-[20px] pb-[35px] text-center @xl:max-w-[515px] @xl:p-[30px] @xl:pb-[30px] @xl:pr-0 @xl:text-left">
            <h1 className="mb-[10px] text-h2/[38.4px] font-medium tracking-[-0.025rem] @xl:mb-[15px] @xl:text-h2/[2.75rem]">
              Welcome to VitaDAO.Global
            </h1>
            <p className="text-base/[22.4px]">
              The new home for VitaDAO members, providing exclusive services,
              portfolio management and governance tools to VITA holders.
            </p>
          </div>
          <div className="hidden flex-shrink flex-grow self-stretch bg-[url('/fresh-3d-bg.jpg')] bg-cover bg-[center_left] bg-no-repeat @xl:block" />
        </div>
        {featuredService && <ServiceCard service={featuredService} />}
        <VitaStatsCard className="p-[20px] @xl:p-[30px]" />
        <div className="flex justify-between">
          <p className="uppercase">Recent Proposals</p>
          <p>
            <Link href="/proposals" className="underline underline-offset-4">
              View All &gt;
            </Link>
          </p>
        </div>
        <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[20px] @xl:gap-[30px]">
          <Proposals first={3} />
        </div>
      </div>
    </div>
  );
}
