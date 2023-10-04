import Link from "next/link";

import { Proposals } from "@/components/server/proposals";
import { VitaStatsCard } from "@/components/server/vita-stats";
import { ServiceCard } from "@/components/ui/service-card";
import { getFeaturedService } from "@/lib/services";

export default async function Page() {
  const featuredService = await getFeaturedService();

  return (
    <div className="space-y-[20px] px-[20px] py-[30px] @xl/main:space-y-[30px] @xl/main:px-[30px]">
      <div className="flex min-h-[220px] flex-col overflow-clip rounded-xl bg-black text-white @xl/main:flex-row">
        <div className="h-[240px] [background:url(/fresh-3d-bg.jpg)left/cover_no-repeat,lightgray_50%/cover_no-repeat] @xl/main:hidden" />
        <div className="flex-1 p-[20px] pb-[35px] text-center @xl/main:max-w-[515px] @xl/main:px-[30px] @xl/main:py-[100px] @xl/main:pr-0 @xl/main:text-left">
          <h1 className="mb-[10px] text-h3/[38.4px] font-medium tracking-[-0.025rem] @xl/main:mb-[15px] @xl/main:text-h2/[2.75rem] sm:text-h2/[38.4px]">
            Welcome to{" "}
            <span className="inline-flex items-center">
              VitaDAO.Global
              <span className="hidden @xl/main:inline-block">
                <span className="icon--vita icon--vita--logo ml-[10px] align-baseline text-h3 text-vita-yellow" />
              </span>
            </span>
          </h1>
          <p className="text-base/[22.4px]">
            The home for VitaDAO members, providing exclusive services,
            portfolio management and governance tools to VITA holders.
          </p>
        </div>
        <div className="hidden flex-shrink flex-grow self-stretch bg-[url('/fresh-3d-bg.jpg')] bg-cover bg-[center_left] bg-no-repeat @xl/main:block" />
      </div>
      {featuredService && <ServiceCard service={featuredService} />}
      <VitaStatsCard className="p-[20px] @xl/main:p-[30px]" />
      <div className="flex justify-between">
        <p className="uppercase">Recent Proposals</p>
        <p>
          <Link
            href="/proposals"
            className="font-semibold leading-[22px] underline underline-offset-4"
          >
            View All
            <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
          </Link>
        </p>
      </div>
      <div className="grid auto-rows-[1fr] grid-cols-1 gap-[20px] @xl/main:gap-[30px] sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <Proposals first={3} />
      </div>
    </div>
  );
}
