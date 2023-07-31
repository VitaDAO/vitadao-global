import Image from "next/image";
import Link from "next/link";

import { Proposals } from "@/components/server/proposals";
import { VitaStatsCard } from "@/components/server/vita-stats";
import { getFeaturedService } from "@/lib/services";
import { cn } from "@/lib/utils";

export default async function Page() {
  const featuredService = await getFeaturedService();

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
      <div className="space-y-5 overflow-hidden rounded-xl bg-black bg-[center_right_-200px] text-white @4xl:bg-[center_right_-50px] md:bg-[url('/fresh-3d-bg.jpg')] md:bg-[length:auto_100%] md:bg-no-repeat md:py-10 md:pb-10">
        <div className="h-52 [background:url(/fresh-3d-bg.jpg)center/cover_no-repeat,lightgray_50%/cover_no-repeat] md:hidden" />
        <div className="p-5 pb-12 text-center md:max-w-sm md:text-left">
          <h1 className="text-h3 font-semibold">Welcome to VitaDAO.Global</h1>
          <p>
            The new home for VitaDAO members, providing exclusive services,
            portfolio management and governance tools to VITA holders.
          </p>
        </div>
      </div>
      {featuredService && (
        <div
          className={cn(
            "grid grid-cols-1 overflow-clip rounded-xl bg-white",
            featuredService.image_path &&
              "@2xl:col-start-1 @2xl:col-end-[-1] @2xl:grid-cols-2"
          )}
        >
          {featuredService.image_path && (
            <div className="max-h-[250px] @2xl:order-2 @2xl:max-h-none">
              <Image
                src={featuredService.image_path}
                alt=""
                width={600}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-5 p-[30px]">
            {featuredService.is_featured && (
              <p className="text-sm uppercase tracking-[0.56px] text-[#606060]">
                Featured service
              </p>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredService.logo_path}
              alt=""
              className="max-h-[25px] object-contain object-left"
            />
            {featuredService.title && (
              <p className="text-h4">{featuredService.title}</p>
            )}
            <p>{featuredService.description}</p>
            <p className="flex flex-grow flex-col justify-end">
              <Link
                href={`/my-services/${featuredService.slug}`}
                className="text-vita-purple underline"
              >
                View this service
              </Link>
            </p>
          </div>
        </div>
      )}
      <VitaStatsCard />
      <div className="flex justify-between">
        <p className="uppercase">Recent Proposals</p>
        <p>
          <Link href="/proposals" className="underline underline-offset-4">
            View All &gt;
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-3">
        <Proposals first={3} />
      </div>
    </div>
  );
}
