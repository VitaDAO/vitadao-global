import Link from "next/link";
import { z } from "zod";

import { ErrorUi } from "@/components/ui/error-ui";
import { Pagination } from "@/components/ui/pagination";
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
        <div className="mb-[30px] flex flex-wrap items-center justify-between gap-[30px]">
          <h1 className="text-h2 font-medium">Endpoints News</h1>
          {maxPage && <Pagination page={page} maxPage={maxPage} />}
        </div>
        <div className="mb-[30px] flex flex-wrap justify-between gap-3">
          <ChannelSelect options={channels} />
          <form method="GET">
            <input
              type="text"
              className="rounded-full border px-5 py-2"
              name="search"
              placeholder="Search"
              defaultValue={search}
            />
          </form>
        </div>
        <div className="mb-[30px] grid auto-rows-[1fr] grid-cols-1 gap-[20px] @xl/main:gap-[30px] sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {items.map((item) => (
            <div
              key={item.pathname}
              className="flex min-h-[300px] flex-col items-start gap-[10px] rounded-xl bg-white p-[20px] @xl:p-[30px]"
            >
              <div className="flex flex-wrap gap-[10px]">
                {item.channels.map((channel) => (
                  <Link
                    key={channel.pathname}
                    href={`?channel=${channel.pathname}`}
                  >
                    <Pill className="border">{channel.name}</Pill>
                  </Link>
                ))}
              </div>
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
              <p className="grow">{item.age}</p>
              {item.pathname && (
                <Link
                  href={item.pathname}
                  className="font-semibold leading-[22px] text-vita-purple underline underline-offset-4"
                >
                  Read
                  <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
                </Link>
              )}
            </div>
          ))}
        </div>
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
