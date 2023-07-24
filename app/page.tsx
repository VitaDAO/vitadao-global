import Image from "next/image";
import Link from "next/link";

import { Proposals } from "@/components/server/proposals";
import { VitaStatsCard } from "@/components/server/vita-stats";

export default async function Page() {
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
          height={427}
          width={640}
          alt=""
          className="row-start-1 h-full max-h-60 w-full object-cover @2xl:col-start-2 @2xl:max-h-none"
        />
      </div>
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
