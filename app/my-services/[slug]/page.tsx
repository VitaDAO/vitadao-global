import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/services";
interface PageProps {
  params: { slug: string };
}

// TODO authz this page. I assume redirect to home if the user doesn't have read
// permissions on this service

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);
  if (service === null) redirect("/");
  return (
    <>
      <Image
        src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`}
        width={1140}
        height={320}
        alt=""
        className="mb-[10px] h-[120px] rounded-[20px] object-cover @3xl:mb-[30px] @3xl:h-[320px]"
      />
      <div className="flex flex-col gap-[20px] @3xl:flex-row @3xl:gap-[30px]">
        <div className="flex-grow @3xl:order-1 @3xl:w-[380px]">
          <div className="flex h-[120px] items-center justify-center rounded-[20px] border border-[#CCCCCC] px-[20px]">
            <Image
              src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.logo}`}
              width={280}
              height={32}
              alt=""
              className="max-h-[32px] w-auto"
            />
          </div>
          <h1 className="mt-[20px] text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl:hidden">
            {service.title}
          </h1>
          <p className="mt-[20px] text-base/[22.4px] font-medium @3xl:hidden">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          <Button className="mt-[20px] w-full">Redeem This Offer</Button>
          <p className="mt-[12px] hidden text-center text-sm text-[#989898] @3xl:block">
            Available to members with{" "}
            <span className="whitespace-nowrap">
              {service.vita_required.toLocaleString()} VITA
            </span>{" "}
            or more
          </p>
        </div>
        <div className="flex-grow @3xl:w-[730px]">
          <h1 className="hidden text-h2 font-medium @3xl:block">
            {service.title}
          </h1>
          <p className="mt-[20px] hidden text-base/[22.4px] font-medium @3xl:block">
            <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
            {service.vita_required.toLocaleString()} VITA +
          </p>
          {/* <div>
            {plainTextToParagraphs(service.body).map((p) => (
              <p
                key={simpleHash(p)}
                className="mt-[1em] first:mt-[22px] last:mb-[30px]"
              >
                {p}
              </p>
            ))}
          </div> */}
          <div
            dangerouslySetInnerHTML={{ __html: service.body }}
            className="[&>p:first-of-type]:mt-[22px] [&>p:last-of-type]:mb-[30px] [&>p]:mt-[1em]"
          />
          <p className="pb-[20px] text-right @3xl:hidden">
            <Link
              href="#"
              className="font-semibold text-vita-purple underline underline-offset-4"
            >
              Redeem This Offer
              <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
            </Link>
          </p>
          <p className="text-right text-sm text-[#989898] @3xl:hidden">
            Available to members with {service.vita_required.toLocaleString()}{" "}
            VITA or more
          </p>
        </div>
      </div>
    </>
  );
}

function plainTextToParagraphs(str: string) {
  return str.split(/\n{2,}/).map((p) => p.trim());
}

// https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
}
