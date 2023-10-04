import Image from "next/image";
import Link from "next/link";

import { type ServiceCard } from "@/lib/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceCard;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  if (service.is_featured) {
    return (
      <div className={cn("@container/card", className)}>
        <div className="grid grid-cols-1 overflow-clip rounded-xl bg-white @3xl/card:min-h-[350px] @3xl/card:grid-cols-2">
          <div className="relative @3xl/card:order-2">
            <Image
              src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.image}`}
              alt=""
              width={600}
              height={300}
              className="h-full max-h-[300px] w-full object-cover @3xl/card:absolute @3xl/card:top-0 @3xl/card:max-h-none"
            />
          </div>
          <div className="flex h-full flex-col p-[20px] md:p-[30px]">
            <div className="mb-[40px] flex flex-wrap justify-between gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.logo}`}
                alt=""
                className="h-[32px] max-w-[270px] object-contain object-left"
              />
              <p className="text-sm/[17px] uppercase tracking-[0.56px] text-[#606060]">
                Featured service
              </p>
            </div>
            <p className="mb-[10px] max-w-[485px] text-h3/[35px] font-medium tracking-[-0.02rem]">
              {service.title}
            </p>
            <p className="mb-[20px] max-w-[485px] flex-grow text-base/[22px]">
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
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://${process.env.PB_HOSTNAME}/api/files/services/${service.id}/${service.logo}`}
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
