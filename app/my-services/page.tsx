import Image from "next/image";
import Link from "next/link";

import { getServices, type Service } from "@/lib/services";
import { cn } from "@/lib/utils";

export default async function Page() {
  // TODO figure out authz/filtering by user. Either we set up cookie auth with
  // Privy and we RSC with the authn user (or whatever is public if no user
  // logged in) or we set up an API route and solve with local storage auth.
  const services = await getServices();

  return (
    <div className="mx-auto max-w-[1260px] @container">
      <div className="px-[20px] py-[30px] @xl:px-[30px] @xl:pt-[90px]">
        <h1 className="mb-[10px] text-h2 font-medium">My Services</h1>
        <p className="mb-[30px] max-w-[770px] text-base">
          Enjoy a suite of member services exclusive to VitaDAO members. VITA
          holders qualify for member services based on the amount of VITA in
          their connected wallet/s.
        </p>
        <div className="grid grid-cols-1 gap-[20px] @2xl:grid-cols-2 md:gap-[30px]">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              className={s.is_featured ? "col-span-full" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  if (service.is_featured) {
    return (
      <div className={cn("@container", className)}>
        <div className="grid grid-cols-1 overflow-clip rounded-xl bg-white @2xl:grid-cols-2">
          <div className="relative @2xl:order-2">
            <Image
              src={service.image_path}
              alt=""
              width={600}
              height={300}
              className="h-full max-h-[300px] w-full object-cover @2xl:absolute @2xl:top-0 @2xl:max-h-none"
            />
          </div>
          <div className="flex h-max flex-col p-[20px] md:p-[30px]">
            <p className="mb-[33px] text-sm/[17px] uppercase tracking-[0.56px] text-[#606060]">
              Featured service
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.logo_path}
              alt=""
              className="mb-[20px] h-[32px] max-w-[270px] object-contain object-left"
            />
            <p className="mb-[10px] max-w-[485px] text-h3/[35px] font-medium tracking-[-0.02rem]">
              {service.title}
            </p>
            <p className="mb-[20px] max-w-[485px] text-base/[22px]">
              {service.summary}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-[10px] text-base/[22px]">
              <Link
                href={`/my-services/${service.slug}`}
                className="font-semibold text-vita-purple underline underline-offset-4"
              >
                View this service
                <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
              </Link>
              <span className="inline-flex items-center font-medium">
                <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
                {service.vita_required.toLocaleString()} VITA +
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl bg-white p-[20px] md:p-[30px]",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={service.logo_path}
        alt=""
        className="mb-[40px] h-[32px] max-w-[270px] object-contain object-left"
      />
      <p className="mb-[88px] text-h4 font-medium">{service.title}</p>
      <div className="flex flex-wrap items-end justify-between gap-[10px] text-base">
        <Link
          href={`/my-services/${service.slug}`}
          className="font-semibold text-vita-purple underline underline-offset-4"
        >
          View this service
          <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
        </Link>
        <span className="inline-flex items-center font-medium">
          <span className="icon--vita icon--vita--logo mr-[10px] text-xs text-vita-yellow" />
          {service.vita_required.toLocaleString()} VITA +
        </span>
      </div>
    </div>
  );
}
