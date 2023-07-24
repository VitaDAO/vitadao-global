import Link from "next/link";
import { z } from "zod";

import { Proposals, fetchSnapshot } from "@/components/server/proposals";

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
    <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-h2 font-semibold">Proposals</h1>
        <div className="flex gap-5">
          {page > 1 && (
            <Link
              href={`/proposals?page=${Number(page) - 1}`}
              className="text-vita-purple underline underline-offset-4"
            >
              &lt; Previous
            </Link>
          )}
          <span>
            Page {page} of {maxPage}
          </span>
          {page < maxPage && (
            <Link
              href={`/proposals?page=${Number(page) + 1}`}
              className="text-vita-purple underline underline-offset-4"
            >
              Next &gt;
            </Link>
          )}
        </div>
      </div>
      <div className="grid auto-rows-[1fr] grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-3">
        <Proposals first={pageSize} skip={pageSize * (page - 1)} />
      </div>
    </div>
  );
}
