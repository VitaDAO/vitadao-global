import Link from "next/link";
import { z } from "zod";

import { ConciseServerPagination } from "@/components/ui/concise-server-pagination";
import { ErrorUi } from "@/components/ui/error-ui";
import { Pill } from "@/components/ui/pill";
import { buildMetadata } from "@/lib/metadata";
import { getEndptsItems, searchEndptsItems } from "@/lib/services/endpts";

import { ChannelSelect } from "./channel-select";

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

    return (
      <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
        <h1 className="mb-[30px] text-h2 font-medium">
          <a href="/service/endpts">Endpoints News</a>
        </h1>
        <div className="mb-[30px] flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <ChannelSelect options={channels} />
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
        <div className="mb-[30px] grid auto-rows-[1fr] grid-cols-1 gap-[20px] @xl/main:gap-[30px] sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
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
