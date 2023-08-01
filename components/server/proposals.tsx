import { z } from "zod";

import { formatNumber } from "@/lib/utils";

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

export async function fetchSnapshot(body: FetchSnapshotProps) {
  return fetch("https://hub.snapshot.org/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

interface ProposalsProps {
  first: number;
  skip?: number;
}

export async function Proposals({ first, skip = 0 }: ProposalsProps) {
  const proposals = proposalsSchema.parse(
    await fetchSnapshot({
      query: proposalsQuery,
      variables: { first, skip },
    })
  );

  return (
    <>
      {proposals.map((p) => (
        <div
          key={p.id}
          className="flex h-full flex-col items-start gap-3 rounded-xl bg-white p-[20px] @xl:p-[30px]"
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
    </>
  );
}
