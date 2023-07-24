import Link from "next/link";
import { z } from "zod";

import { formatNumber } from "@/lib/utils";

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

// Query and schema for proposals
const proposalsQuery = `query Query($first: Int!, $skip: Int!) {
  proposals(first: $first, skip: $skip, where: {space: "vote.vitadao.eth"}, orderBy: "created", orderDirection: desc) {
    id
    title
    state
    link
    scores_total
  }
}`;

const proposalsSchema = z
  .object({
    data: z.object({
      proposals: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          state: z.union([z.literal("active"), z.literal("closed")]),
          link: z.string().url(),
          scores_total: z.number(),
        })
      ),
    }),
  })
  .transform((val) => val.data.proposals);

function getCategory(title: string) {
  if (title.includes("[Project]")) {
    return "Project";
  } else if (title.includes("[IP]")) {
    return "IP";
  } else if (title.includes("[Funding]")) {
    return "Funding";
  } else {
    return "Governance";
  }
}

interface CategoryProps {
  title: string;
}

function Category({ title }: CategoryProps) {
  const category = getCategory(title);

  switch (category) {
    case "Funding":
      return (
        <span className="rounded-md bg-vita-yellow px-2 py-1 text-xs uppercase">
          {category}
        </span>
      );
    case "Project":
      return (
        <span className="rounded-md bg-vita-yellow px-2 py-1 text-xs uppercase">
          {category}
        </span>
      );
    case "Governance":
      return (
        <span className="rounded-md bg-vita-purple px-2 py-1 text-xs uppercase text-white">
          {category}
        </span>
      );
    case "IP":
      return (
        <span className="rounded-md bg-vita-yellow px-2 py-1 text-xs uppercase">
          {category}
        </span>
      );
  }
}

interface FetchSnapshotProps {
  query: string;
  variables?: Record<string, unknown>;
}

async function fetchSnapshot(body: FetchSnapshotProps) {
  return fetch("https://hub.snapshot.org/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

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

  // Fetch "page" of proposals
  const proposals = proposalsSchema.parse(
    await fetchSnapshot({
      query: proposalsQuery,
      variables: { first: pageSize, skip: pageSize * (page - 1) },
    })
  );

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
        {proposals.map((p) => (
          <div
            key={p.id}
            className="flex h-full flex-col items-start gap-3 rounded-xl bg-white p-5"
          >
            <Category title={p.title} />
            <p className="line-clamp-3 text-h4">{p.title}</p>
            {p.state === "active" ? (
              <p className="flex-grow text-green-500">Voting is active</p>
            ) : (
              <p className="flex-grow">
                Voting closed | {formatNumber(p.scores_total)} Total Votes
              </p>
            )}
            <a
              href={p.link}
              target="_blank"
              className="text-vita-purple underline underline-offset-4"
            >
              {p.state === "active" ? "Review & Vote" : "Review"} &gt;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
