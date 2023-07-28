import Link from "next/link";
import { z } from "zod";

import { Proposals, fetchSnapshot } from "@/components/server/proposals";
import { cn } from "@/lib/utils";

// Query and schema for total number of proposals
const proposalsCountQuery = `query {
  space(id: "vote.vitadao.eth") {
    proposalsCount
  }
}`;

const proposalsCountSchema = z
  .object({
    data: z.object({
      space: z.object({
        proposalsCount: z.number(),
      }),
    }),
  })
  .transform((val) => val.data.space.proposalsCount);

interface PageProps {
  searchParams?: { page?: number };
}

export default async function Page({ searchParams = {} }: PageProps) {
  // Get the total number of proposals
  const proposalsCount = proposalsCountSchema.parse(
    await fetchSnapshot({ query: proposalsCountQuery })
  );

  // Parse valid page value from search params
  const pageSize = 9;
  const maxPage = Math.ceil(proposalsCount / pageSize);

  const searchParamsSchema = z
    .object({
      page: z.coerce
        .number()
        .catch(1)
        .transform((n) => Math.max(1, Math.min(n, maxPage))),
    })
    .transform((val) => val.page);

  const page = searchParamsSchema.parse(searchParams);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 @container">
      <h1 className="text-h2 font-semibold">Proposals</h1>
      <div className="flex justify-center text-vita-purple">
        {page > 1 && (
          <Link
            href={`/proposals?page=${Number(page) - 1}`}
            className="rounded-l-full border border-[#CCCCCC] px-4 py-2"
          >
            Prev
          </Link>
        )}
        {getPaginationList(page, maxPage).map((cur, idx) =>
          cur === "..." ? (
            <span
              key={`oh-god-i-hate-keys-${idx}`}
              className="border-b border-r border-t border-[#CCCCCC] px-4 py-2"
            >
              ...
            </span>
          ) : (
            <Link
              key={cur}
              href={`/proposals?page=${Number(cur)}`}
              className={cn(
                "border-b border-r border-t border-[#CCCCCC] px-4 py-2 first:rounded-l-full first:border-l last:rounded-r-full",
                page === cur && "border-vita-purple",
                page - 1 === cur && "border-r-vita-purple"
              )}
            >
              {cur}
            </Link>
          )
        )}
        {page < maxPage && (
          <Link
            href={`/proposals?page=${Number(page) + 1}`}
            className="rounded-r-full border-b border-r border-t border-[#CCCCCC] px-4 py-2"
          >
            Next
          </Link>
        )}
      </div>
      <div className="grid auto-rows-[1fr] grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-3">
        <Proposals first={pageSize} skip={pageSize * (page - 1)} />
      </div>
    </div>
  );
}

function getPaginationList(page: number, maxPage: number) {
  const middleRange = [page - 1, page, page + 1].filter(
    (p) => p > 1 && p < maxPage
  );

  const pages = Array.from(
    new Set([1, 2, ...middleRange, maxPage - 1, maxPage])
  );

  const paginationList = pages.reduce<(number | "...")[]>((acc, cur) => {
    const last = acc.slice(-1)[0];
    if (last === undefined || last === "..." || last === cur - 1) {
      return [...acc, cur];
    } else {
      return [...acc, "...", cur];
    }
  }, []);

  return paginationList;
}
