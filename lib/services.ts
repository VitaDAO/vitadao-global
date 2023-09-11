import { z } from "zod";

import { getFirstListItem, getFullList } from "@/lib/pocketbase";
import { getUserBalance, getUserDid } from "@/lib/users";

const ServiceSchema = z.object({
  id: z.string(),
  collectionID: z.string(),
  collectionName: z.string(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
  title: z.string(),
  summary: z.string(),
  body: z.string(),
  vita_required: z.number(),
  slug: z.string(),
  is_featured: z.boolean(),
  order: z.number(),
  logo: z.string(),
  image: z.string(),
  read_access: z.union([
    z.literal("public"),
    z.literal("private"),
    z.literal("holder"),
    z.literal("redeemer"),
  ]),
  redemption_details: z
    .object({
      type: z.literal("promo-code"),
      payload: z.string(),
    })
    .nullable(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const ServiceCardSchema = ServiceSchema.pick({
  id: true,
  title: true,
  summary: true,
  vita_required: true,
  slug: true,
  is_featured: true,
  order: true,
  logo: true,
  image: true,
});

const serviceCardFields =
  "id,title,summary,vita_required,slug,is_featured,order,logo,image";

export type ServiceCard = z.infer<typeof ServiceCardSchema>;

export const ServiceStandaloneSchema = ServiceSchema.pick({
  id: true,
  title: true,
  body: true,
  vita_required: true,
  logo: true,
  image: true,
  redemption_details: true,
});

const serviceStandaloneFields =
  "id,title,body,vita_required,logo,image,redemption_details";

export type ServiceStandalone = z.infer<typeof ServiceStandaloneSchema>;

function or(...args: Array<undefined | null | boolean | string>) {
  return "(" + args.filter(Boolean).join(") || (") + ")";
}

function and(...args: Array<undefined | null | boolean | string>) {
  return "(" + args.filter(Boolean).join(") && (") + ")";
}

interface User {
  did: string | null;
  balance: number;
}

async function getUserAuthzProperties() {
  const did = await getUserDid();

  let balance = 0;
  if (did !== null) {
    balance = await getUserBalance(did);
  }

  return {
    did,
    balance,
  };
}

function buildFilter({ user, filter }: { user: User; filter?: string }) {
  const { did, balance } = user;
  // The read permissions are as follows:
  // - "public" services are readable by everyone.
  // - "private" services are readable by logged in users, irrespective of VITA
  //   balance.
  // - "holder" services are readable by logged in users with VITA balance greater
  //   than zero.
  // - "redeemer" services are readable only by those with enough VITA to actually
  //   redeem the service.
  return and(
    filter,
    or(
      `read_access = "public"`,
      did && `read_access = "private"`,
      did && balance > 0 && `read_access = "holder"`,
      did && `read_access = "redeemer" && vita_required <= ${balance}`,
    ),
  );
}

export async function getServices() {
  const user = await getUserAuthzProperties();
  const filter = buildFilter({ user });
  const fields = serviceCardFields;

  const services = ServiceCardSchema.array().parse(
    await getFullList("services", { filter, fields }),
  );

  return services;
}

export async function getServiceBySlug(slug: string) {
  const user = await getUserAuthzProperties();
  const filter = buildFilter({ user, filter: `slug = "${slug}"` });
  const fields = serviceStandaloneFields;

  const service = ServiceStandaloneSchema.nullable().parse(
    await getFirstListItem("services", filter, { fields }),
  );

  if (service === null) return null;

  if (user.did === null || user.balance < service.vita_required) {
    service.redemption_details = null;
  }

  return service;
}

export async function getFeaturedService() {
  const user = await getUserAuthzProperties();
  const filter = buildFilter({ user, filter: "is_featured = true" });
  const fields = serviceCardFields;

  const service = ServiceCardSchema.nullable().parse(
    await getFirstListItem("services", filter, { fields }),
  );

  return service;
}
