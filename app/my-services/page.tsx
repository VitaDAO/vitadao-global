import type { Metadata } from "next";

import { ServiceCard } from "@/components/ui/service-card";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "My Services",
};

export default async function Page() {
  const services = await getServices();

  return (
    <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
      <h1 className="mb-[10px] text-h2 font-medium">My Services</h1>
      <p className="mb-[30px] max-w-[770px] text-base">
        Enjoy a suite of member services exclusive to VitaDAO members. VITA
        holders qualify for member services based on the amount of VITA in their
        connected wallet/s.
      </p>
      <div className="grid grid-cols-1 gap-[20px] @2xl/main:grid-cols-2 md:gap-[30px]">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            className={s.is_featured ? "col-span-full" : ""}
          />
        ))}
      </div>
    </div>
  );
}
