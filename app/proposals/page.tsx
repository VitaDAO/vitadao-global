import { z } from "zod";

import { Proposals, fetchSnapshot } from "@/components/server/proposals";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    await fetchSnapshot({ query: proposalsCountQuery }),
  );

  // Parse valid page value from search params
  const pageSize = 36;
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
    <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
      <div className="mb-[30px] flex flex-wrap items-center justify-between gap-[30px]">
        <h1 className="text-h2 font-medium">Proposals</h1>
        <Pagination page={page} maxPage={maxPage} />
      </div>
      <div className="mb-[30px] grid auto-rows-[1fr] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[20px] @xl/main:gap-[30px]">
        <Proposals first={pageSize} skip={pageSize * (page - 1)} />
      </div>
      <Pagination page={page} maxPage={maxPage} className="justify-end" />
    </div>
  );
}

interface PaginationProps {
  page: number;
  maxPage: number;
  className?: string;
}

function Pagination({ page, maxPage, className }: PaginationProps) {
  return (
    <div className={cn("flex gap-[10px] text-vita-purple", className)}>
      {page > 1 && (
        <Link
          href={`/proposals?page=${Number(page) - 1}`}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          Prev
        </Link>
      )}
      {getPaginationList(page, maxPage).map((cur, idx) =>
        cur === "..." ? (
          <span
            key={`oh-god-i-hate-keys-${idx}`}
            className="flex h-[42px] items-center justify-center text-[#CCCCCC]"
          >
            ...
          </span>
        ) : (
          <Link
            key={cur}
            href={`/proposals?page=${Number(cur)}`}
            className={cn(
              "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] px-4 py-2",
              page === cur && "border-vita-purple",
            )}
          >
            {cur}
          </Link>
        ),
      )}
      {page < maxPage && (
        <Link
          href={`/proposals?page=${Number(page) + 1}`}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          Next
        </Link>
      )}
    </div>
  );
}

function getPaginationList(page: number, maxPage: number) {
  const middleRange = [page - 1, page, page + 1].filter(
    (p) => p > 1 && p < maxPage,
  );

  const pages = Array.from(
    new Set([1, 2, ...middleRange, maxPage - 1, maxPage]),
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
