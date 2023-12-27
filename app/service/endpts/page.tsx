import { SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { ConciseServerPagination } from "@/components/ui/concise-server-pagination";
import { ErrorUi } from "@/components/ui/error-ui";
import { Pill } from "@/components/ui/pill";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buildMetadata } from "@/lib/metadata";
import { getEndptsItems, searchEndptsItems } from "@/lib/services/endpts";

import endpoints from "./endpts-logo-01-endpoints.svg";
import news from "./endpts-logo-02-news.svg";

export const metadata = buildMetadata({
  title: "Endpoints News",
});

const pageSchema = z.coerce
  .number()
  .catch(1)
  .transform((n) => Math.max(1, n));
const channelSchema = z.string().optional();
const searchSchema = z.string().optional();

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  try {
    const page = pageSchema.parse(searchParams?.page);
    const channel = channelSchema.parse(searchParams?.channel);
    const search = searchSchema.parse(searchParams?.search);

    const { items, maxPage, channels } = search
      ? await searchEndptsItems({ page, search })
      : await getEndptsItems({
          page,
          channel,
        });

    const selectedChannelLabel =
      channels.find(({ value }) => value === channel)?.label ?? "Pick channel";

    return (
      <div className="flex grow flex-col px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
        <h1 className="mb-[30px] text-h2 font-medium">
          <a
            href="/service/endpts"
            className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 px-1 py-3"
          >
            <Image
              src={endpoints}
              alt="Endpoints"
              className="h-[30px] w-auto"
            />
            <Image src={news} alt="News" className="h-[30px] w-auto" />
          </a>
        </h1>
        <div className="mb-[30px] flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger className="relative h-[42px] min-w-[210px] rounded-full border bg-white px-4 text-left">
                {selectedChannelLabel}
                <span className="icon--vita icon--vita--chevron absolute right-[15px] top-1/2 -translate-y-1/2 rotate-180 text-xs text-[#989898]" />
              </PopoverTrigger>
              <PopoverContent
                className="max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] overflow-auto rounded-xl p-0"
                collisionPadding={20}
              >
                <ul>
                  {channels.map(({ label, value }) => (
                    <a key={value} href={`?channel=${value}`}>
                      <li className="px-3 py-2 hover:bg-gray-50">{label}</li>
                    </a>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <form method="GET" className="relative">
              <span className="absolute left-[1px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full text-[#A4A4A4]">
                <span className="icon--vita icon--vita--search" />
              </span>
              <input
                type="text"
                className="rounded-full border py-2 pl-[40px] pr-5 placeholder:text-[#A4A4A4]"
                name="search"
                placeholder="Search"
                defaultValue={search}
              />
            </form>
          </div>
          {maxPage && (
            <ConciseServerPagination
              page={page}
              maxPage={maxPage}
              searchParams={searchParams}
            />
          )}
        </div>
        {items.length > 0 ? (
          <div className="mb-[30px] grid auto-rows-[1fr] grid-cols-1 gap-[20px] @xl/main:gap-[30px] sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {items.map((item) => (
              <div
                key={item.pathname}
                className="flex min-h-[300px] flex-col items-start gap-[28px] rounded-xl bg-white p-[20px] @xl:p-[30px]"
              >
                {item.imageSrc &&
                  (item.pathname ? (
                    <Link
                      href={item.pathname}
                      className="underline-offset-4 hover:underline"
                    >
                      <img
                        src={item.imageSrc}
                        alt=""
                        height={104}
                        width={156}
                        className="h-[104px] w-[156px] rounded-lg object-cover"
                      />
                    </Link>
                  ) : (
                    <img
                      src={item.imageSrc}
                      alt=""
                      height={104}
                      width={156}
                      className="h-[104px] w-[156px] rounded-lg object-cover"
                    />
                  ))}
                <div className="flex grow flex-col gap-[10px]">
                  {item.channels.length > 0 && (
                    <div className="flex flex-wrap gap-[10px]">
                      {item.channels.map((channel) => (
                        <a
                          key={channel.pathname}
                          href={`?channel=${channel.pathname}`}
                        >
                          <Pill className="border border-[#CCCCCC] pb-[1px] pt-[3px] hover:bg-[#EEE]">
                            {channel.name}
                          </Pill>
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="line-clamp-4 pt-[5px] text-h4 font-medium leading-[120%]">
                    {item.pathname ? (
                      <Link
                        href={item.pathname}
                        className="underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="text-[#CCCCCC]">{item.age}</p>
                </div>
                {item.pathname && (
                  <Link
                    href={item.pathname}
                    className="font-semibold leading-[22px] text-vita-purple underline underline-offset-4"
                  >
                    Read this article
                    <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex grow flex-col items-center justify-center gap-3 text-center text-h4 text-[#989898]">
            <SearchX className="h-10 w-10" />
            <p>Nothing found</p>
          </div>
        )}
        {maxPage && (
          <div className="flex justify-end">
            <ConciseServerPagination
              page={page}
              maxPage={maxPage}
              searchParams={searchParams}
            />
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      return <ErrorUi error={e} />;
    } else {
      return <ErrorUi error={new Error("Unknown error")} />;
    }
  }
}
