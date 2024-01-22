import { z } from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ServiceCard } from "@/components/ui/service-card";
import { buildMetadata } from "@/lib/metadata";
import { getServiceCategories, getServices } from "@/lib/services";
import { type NextSearchParams } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "My Services",
});

export default async function Page({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const categories = [
    { label: "All Services", slug: "" },
    ...(await getServiceCategories()),
  ];
  let categorySearchParam = z
    .string()
    .refine((val) => categories.map(({ slug }) => slug).includes(val))
    .catch("")
    .parse(searchParams?.category);

  const selectedCategoryLabel =
    categories.find(({ slug }) => slug === categorySearchParam)?.label ||
    "Pick a category";

  const services = await getServices({
    filter:
      categorySearchParam && `categories.slug ?= "${categorySearchParam}"`,
  });

  return (
    <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
      <h1 className="mb-[10px] text-h2 font-medium">My Services</h1>
      <div className="mb-[30px] flex flex-wrap justify-between gap-[10px]">
        <p className="max-w-[770px] text-base">
          Enjoy a suite of member services exclusive to VitaDAO members. VITA
          holders qualify for member services based on the amount of VITA in
          their linked wallet/s.
        </p>
        <Popover>
          <PopoverTrigger className="relative h-[42px] min-w-[210px] rounded-full border bg-white px-4 text-left">
            {selectedCategoryLabel}
            <span className="icon--vita icon--vita--chevron absolute right-[15px] top-1/2 -translate-y-1/2 rotate-180 text-xs text-[#989898]" />
          </PopoverTrigger>
          <PopoverContent
            className="max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] overflow-auto rounded-xl p-0"
            collisionPadding={20}
          >
            <ul>
              {categories
                .filter(({ slug }) => slug !== categorySearchParam)
                .map(({ label, slug }) => (
                  <a
                    key={slug}
                    href={
                      slug ? `/my-services?category=${slug}` : "/my-services"
                    }
                  >
                    <li className="px-3 py-2 hover:bg-gray-50">{label}</li>
                  </a>
                ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 gap-[20px] @2xl/main:grid-cols-2 md:gap-[30px]">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            className={s.is_featured ? "col-span-full" : ""}
            selectedCategory={categorySearchParam}
          />
        ))}
      </div>
    </div>
  );
}
