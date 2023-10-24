import { z } from "zod";

import { Pill } from "@/components/ui/pill";
import { formatNumber } from "@/lib/utils";

const proposalsQuery = `query Query($first: Int!, $skip: Int!) {
  proposals(first: $first, skip: $skip, where: {space: "vote.vitadao.eth"}, orderBy: "created", orderDirection: desc) {
    id
    title
    state
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
          scores_total: z.number(),
        }),
      ),
    }),
  })
  .transform((val) => val.data.proposals);

function Category({ title }: { title: string }) {
  let category = "Governance";
  if (title.includes("[Project]")) {
    category = "Project";
  } else if (title.includes("[IP]")) {
    category = "IP";
  } else if (title.includes("[Funding]")) {
    category = "Funding";
  } else if (title.includes("[Assessment]")) {
    category = "Assessment";
  }

  return (
    <Pill
      className={
        category === "Governance"
          ? "bg-vita-purple text-white"
          : "bg-vita-yellow"
      }
    >
      {category}
    </Pill>
  );
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
    next: { revalidate: 60 },
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
              <Pill className="bg-[#41F4D4]">VOTING ACTIVE</Pill>
            )}
          </div>
          <p className="line-clamp-3 pt-[5px] text-h4 font-medium leading-[120%]">
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
            href={"https://vote.vitadao.com/#/proposal/" + p.id}
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
