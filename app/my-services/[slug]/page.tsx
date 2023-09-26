import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buildMetadata } from "@/lib/metadata";
import { getServiceBySlug } from "@/lib/services";
import { RedemptionButton } from "./redemption-button";

interface PageProps {
  params: { slug: string };
}

async function getService(params: PageProps["params"]) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);
  if (service === null) redirect("/");
  return service;
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const service = await getService(params);

  return buildMetadata({
    title: service.title,
  });
}

export default async function Page({ params }: PageProps) {
  const service = await getService(params);

  return (
    <>
      <Image
        src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`}
        width={1140}
        height={320}
        alt=""
        className="mb-[10px] h-[120px] rounded-[20px] object-cover @3xl/main:mb-[30px] @3xl/main:h-[320px]"
      />
      <div className="flex flex-col gap-[20px] @3xl/main:flex-row @3xl/main:gap-[30px]">
        <div className="flex-grow @3xl/main:order-1 @3xl/main:w-[380px]">
          <div className="flex h-[120px] items-center justify-center rounded-[20px] border border-[#CCCCCC] px-[20px]">
            <Image
              src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.logo}`}
              width={280}
              height={32}
              alt=""
              className="max-h-[32px] w-auto"
            />
          </div>
          <h1 className="mt-[20px] text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl/main:hidden">
            {service.title}
          </h1>
          <p className="mt-[20px] text-base/[22.4px] font-medium @3xl/main:hidden">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <RedemptionButton service={service} className="mt-[20px] w-full" />
          <p className="mt-[12px] hidden text-center text-sm text-[#989898] @3xl/main:block">
            Available to members with{" "}
            <span className="whitespace-nowrap">
              {service.vita_required.toLocaleString()} VITA
            </span>{" "}
            or more
          </p>
        </div>
        <div className="flex-grow @3xl/main:w-[730px]">
          <h1 className="hidden text-h2 font-medium @3xl/main:block">
            {service.title}
          </h1>
          <p className="mt-[20px] hidden text-base/[22.4px] font-medium @3xl/main:block">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: service.body }}
            className="prose"
          />
          <p className="pb-[20px] text-right @3xl/main:hidden">
            <Link
              href="#"
              className="font-semibold text-vita-purple underline underline-offset-4"
            >
              Redeem This Offer
              <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
            </Link>
          </p>
          <p className="text-right text-sm text-[#989898] @3xl/main:hidden">
            Available to members with {service.vita_required.toLocaleString()}{" "}
            VITA or more
          </p>
        </div>
      </div>
    </>
  );
}
