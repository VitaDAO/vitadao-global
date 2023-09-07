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
});

const serviceStandaloneFields = "id,title,body,vita_required,logo,image";

export type ServiceStandalone = z.infer<typeof ServiceStandaloneSchema>;

// TODO gate these functions with authz and make them more robust against
// missing data or throws.

async function buildAuthzFilter() {
  const did = await getUserDid();
  let balance = 0;
  if (did !== null) {
    balance = await getUserBalance(did);
  }

  // The read permissions are as follows:
  // - "public" services are readable by everyone.
  // - "private" services are readable by logged in users, irrespective of VITA
  //   balance.
  // - "holder" services are readable by logged in users with VITA balance greater
  //   than zero.
  // - "redeemer" services are readable only by those with enough VITA to actually
  //   redeem the service.
  return [
    `read_access = "public"`,
    did && `read_access = "private"`,
    did && balance > 0 && `read_access = "holder"`,
    did && `read_access = "redeemer" && vita_required <= ${balance}`,
  ]
    .filter(Boolean)
    .join(" || ");
}

export async function getServices() {
  const filter = await buildAuthzFilter();
  const fields = serviceCardFields;

  const services = ServiceCardSchema.array().parse(
    await getFullList("services", { filter, fields }),
  );

  return services;
}

export async function getServiceBySlug(slug: string) {
  const filter = `slug = "${slug}" && (${await buildAuthzFilter()})`;
  const fields = serviceStandaloneFields;

  const service = ServiceStandaloneSchema.nullable().parse(
    await getFirstListItem("services", filter, { fields }),
  );

  return service;
}

export async function getFeaturedService() {
  const filter = `is_featured = true && (${await buildAuthzFilter()})`;
  const fields = serviceCardFields;

  const service = ServiceCardSchema.nullable().parse(
    await getFirstListItem("services", filter, { fields }),
  );

  return service;
}
