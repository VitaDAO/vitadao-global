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
          state: z.union([
            z.literal("active"),
            z.literal("closed"),
            z.literal("pending"),
          ]),
          link: z.string().url(),
          scores_total: z.number(),
        }),
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
        <span className="rounded-md bg-vita-yellow px-[7px] py-[2px] text-xs font-medium uppercase leading-[140%] tracking-[1.2px]">
          {category}
        </span>
      );
    case "Project":
      return (
        <span className="rounded-md bg-vita-yellow px-[7px] py-[2px] text-xs font-medium uppercase leading-[140%] tracking-[1.2px]">
          {category}
        </span>
      );
    case "Governance":
      return (
        <span className="rounded-md bg-vita-purple px-[7px] py-[2px] text-xs font-medium uppercase leading-[140%] tracking-[1.2px] text-white">
          {category}
        </span>
      );
    case "IP":
      return (
        <span className="rounded-md bg-vita-yellow px-[7px] py-[2px] text-xs font-medium uppercase leading-[140%] tracking-[1.2px]">
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
  console.log("proposals", first, skip);
  const proposals = proposalsSchema.parse(
    await fetchSnapshot({
      query: proposalsQuery,
      variables: { first, skip },
    }),
  );

  return (
    <>
      {proposals.map((p) => (
        <div
          key={p.id}
          className="flex min-h-[300px] flex-col items-start gap-[10px] rounded-xl bg-white p-[20px] @xl:p-[30px]"
        >
          <div className="flex flex-wrap gap-[10px]">
            <Category title={p.title} />
            {p.state === "active" && (
              <span className="rounded-md bg-[#41F4D4] px-[7px] py-[2px] text-xs font-medium uppercase leading-[140%] tracking-[1.2px]">
                VOTING ACTIVE
              </span>
            )}
          </div>
          <p className="line-clamp-3 text-h4 font-medium leading-[120%]">
            {p.title}
          </p>
          <div className="flex-grow">
            {p.state === "pending" ? (
              <p className="leading-[140%] text-[#FF6C5C]">Voting is pending</p>
            ) : p.state === "closed" ? (
              <p className="leading-[140%] ">
                Voting closed | {formatNumber(p.scores_total)} Total Votes
              </p>
            ) : null}
          </div>
          <a
            href={p.link}
            target="_blank"
            className="font-semibold leading-[22px] text-vita-purple underline underline-offset-4"
          >
            {p.state === "active" ? "Review & Vote" : "Review"}
            <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
          </a>
        </div>
      ))}
    </>
  );
}
