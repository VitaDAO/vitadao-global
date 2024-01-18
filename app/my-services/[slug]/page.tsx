import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getServiceBySlug } from "@/lib/services";
import { getUserBalance, getUserDidFromCookie } from "@/lib/users";
import { RedemptionTrigger } from "./redemption-trigger";

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
  const imagePath = `https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`;

  return buildMetadata({
    title: service.title,
    description: service.summary,
    imagePath,
  });
}

export default async function Page({ params }: PageProps) {
  const did = await getUserDidFromCookie();
  const balance = did ? await getUserBalance(did) : 0;
  const service = await getService(params);

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
              className="w-full h-full object-contain max-w-[220px]"
            />
          </div>
          <h1 className="mt-[20px] text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl/main:hidden">
            {service.title}
          </h1>
          <p className="mt-[20px] text-base/[22.4px] font-medium @3xl/main:hidden">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <RedemptionTrigger did={did} balance={balance} service={service}>
            <Button className="mt-[20px] w-full">Redeem This Offer</Button>
          </RedemptionTrigger>
          {did !== null && balance >= service.vita_required ? (
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
          <h1 className="hidden text-h2 font-medium @3xl/main:block">
            {service.title}
          </h1>
          <p className="mb-[22px] mt-[30px] hidden text-base/[22.4px] font-medium @3xl/main:block">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: service.body }}
            className="prose text-black"
          />
          <p className="pb-[20px] text-right @3xl/main:hidden">
            <RedemptionTrigger did={did} balance={balance} service={service}>
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
