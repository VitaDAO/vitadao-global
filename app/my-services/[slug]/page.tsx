import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { buildMetadata } from "@/lib/metadata";
import { getServiceBySlug } from "@/lib/services";
import { getCurrentUser } from "@/lib/user";

import { RedemptionTrigger } from "./redemption-trigger";

interface PageProps {
  params: { slug: string };
}

const getService = cache(async (slug: string) => {
  const service = await getServiceBySlug(slug);
  if (service === null) redirect("/");
  return service;
});

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const service = await getService(params.slug);
  const imagePath = `https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`;

  return buildMetadata({
    title: service.title,
    description: service.summary,
    imagePath,
  });
}

export default async function Page({ params }: PageProps) {
  const { did = null, totalVita = 0 } = (await getCurrentUser()) ?? {};
  const service = await getService(params.slug);

  return (
    <>
      <Image
        src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`}
        width={1140}
        height={480}
        alt=""
        className="mb-[10px] aspect-[1140/480] w-full rounded-[20px] object-cover @3xl/main:mb-[30px]"
      />
      <div className="flex flex-col gap-[20px] @3xl/main:flex-row @3xl/main:gap-[30px]">
        <div className="flex-grow @3xl/main:order-1 @3xl/main:w-[380px]">
          <div className="flex h-[200px] items-center justify-center rounded-[20px] border border-[#CCCCCC] p-[20px] @3xl/main:p-[30px]">
            <Image
              src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.logo}`}
              width={280}
              height={32}
              alt=""
              className="h-full w-full max-w-[220px] object-contain"
            />
          </div>
          {service.expand.categories.length > 0 && (
            <div className="mt-[30px] flex flex-wrap gap-[10px] @3xl/main:hidden">
              {service.expand.categories.map(({ label, slug }) => (
                <Link
                  key={slug}
                  href={`/my-services?category=${slug}`}
                  prefetch={false}
                >
                  <Pill className="border border-[#CCCCCC] pb-[1px] pt-[3px] hover:bg-[#EEE]">
                    {label}
                  </Pill>
                </Link>
              ))}
            </div>
          )}
          <h1 className="mt-[20px] text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl/main:hidden">
            {service.title}
          </h1>
          <p className="mt-[20px] text-base/[22.4px] font-medium @3xl/main:hidden">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <RedemptionTrigger did={did} balance={totalVita} service={service}>
            <Button className="mt-[20px] w-full">Redeem This Offer</Button>
          </RedemptionTrigger>
          {did !== null && totalVita >= service.vita_required ? (
            <p className="mt-[12px] hidden text-center text-sm text-[#989898] @3xl/main:block">
              Congratulations, you can redeem this offer!
            </p>
          ) : (
            <p className="mt-[12px] hidden text-center text-sm text-[#989898] @3xl/main:block">
              Available to members with{" "}
              <span className="whitespace-nowrap">
                {service.vita_required.toLocaleString()} VITA
              </span>{" "}
              or more
            </p>
          )}
        </div>
        <div className="flex-grow @3xl/main:w-[730px]">
          {service.expand.categories.length > 0 && (
            <div className="mb-[20px] hidden flex-wrap gap-[10px] @3xl/main:flex">
              {service.expand.categories.map(({ label, slug }) => (
                <Link
                  key={slug}
                  href={`/my-services?category=${slug}`}
                  prefetch={false}
                >
                  <Pill className="border border-[#CCCCCC] pb-[1px] pt-[3px] hover:bg-[#EEE]">
                    {label}
                  </Pill>
                </Link>
              ))}
            </div>
          )}
          <h1 className="hidden text-h2 font-medium @3xl/main:block">
            {service.title}
          </h1>
          <p className="mb-[22px] mt-[30px] hidden text-base/[22.4px] font-medium @3xl/main:block">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: service.body }}
            className="prose mb-[20px] text-black @xl/main:mb-[30px] @3xl/main:mb-0"
          />
          <p className="pb-[20px] text-right @3xl/main:hidden">
            <RedemptionTrigger did={did} balance={totalVita} service={service}>
              <button className="font-semibold text-vita-purple underline underline-offset-4">
                Redeem This Offer
                <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
              </button>
            </RedemptionTrigger>
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
