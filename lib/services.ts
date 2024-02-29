import "server-only";

import { z } from "zod";

import { getFirstListItem, getFullList } from "@/lib/pocketbase";
import { User, getCurrentUser } from "@/lib/user";

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
  redemption_instructions: z.string(),
  published: z.boolean(),
  categories: z.array(z.string()),
  expand: z.object({
    categories: z.array(
      z.object({
        label: z.string(),
        slug: z.string(),
      }),
    ),
  }),
});

const ServiceCardSchema = ServiceSchema.pick({
  id: true,
  title: true,
  summary: true,
  vita_required: true,
  slug: true,
  is_featured: true,
  order: true,
  logo: true,
  image: true,
  expand: true,
});

const serviceCardFields =
  "id,title,summary,vita_required,slug,is_featured,order,logo,image,expand.categories.label,expand.categories.slug";

const serviceCardExpand = "categories";

export type ServiceCard = z.infer<typeof ServiceCardSchema>;

const ServiceStandaloneSchema = ServiceSchema.pick({
  id: true,
  title: true,
  summary: true,
  body: true,
  vita_required: true,
  logo: true,
  image: true,
  redemption_instructions: true,
  expand: true,
});

const serviceStandaloneFields =
  "id,title,summary,body,vita_required,logo,image,redemption_instructions,expand.categories.label,expand.categories.slug";

const serviceStandaloneExpand = "categories";

export type ServiceStandalone = z.infer<typeof ServiceStandaloneSchema>;

function or(...args: Array<undefined | null | boolean | string>) {
  return "(" + args.filter(Boolean).join(") || (") + ")";
}

function and(...args: Array<undefined | null | boolean | string>) {
  return "(" + args.filter(Boolean).join(") && (") + ")";
}

function buildFilter({ user, filter }: { user: User | null; filter?: string }) {
  const { did = null, totalVita = 0 } = user ?? {};
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
    "published = true",
    or(
      `read_access = "public"`,
      did && `read_access = "private"`,
      did && totalVita > 0 && `read_access = "holder"`,
      did && `read_access = "redeemer" && vita_required <= ${totalVita}`,
    ),
  );
}

export async function getServices({
  expand = serviceCardExpand,
  fields = serviceCardFields,
  filter,
}: {
  expand?: string;
  fields?: string;
  filter?: string;
} = {}) {
  const user = await getCurrentUser();

  const services = ServiceCardSchema.array().parse(
    await getFullList("services", {
      expand,
      fields,
      filter: buildFilter({ filter, user }),
      sort: "order",
    }),
  );

  return services;
}

export async function getServiceBySlug(slug: string) {
  const user = await getCurrentUser();
  const filter = buildFilter({ user, filter: `slug = "${slug}"` });
  const fields = serviceStandaloneFields;
  const expand = serviceStandaloneExpand;

  const service = ServiceStandaloneSchema.nullable().parse(
    await getFirstListItem("services", filter, { expand, fields }),
  );

  if (service === null) return null;

  if (user === null || user.totalVita < service.vita_required) {
    service.redemption_instructions = "";
  }

  return service;
}

export async function getFeaturedService() {
  const user = await getCurrentUser();
  const filter = buildFilter({ user, filter: "is_featured = true" });
  const fields = serviceCardFields;
  const expand = serviceCardExpand;

  const service = ServiceCardSchema.nullable().parse(
    await getFirstListItem("services", filter, {
      expand,
      fields,
      sort: "order",
    }),
  );

  return service;
}

const CategoriesSchema = z.array(
  z.object({
    label: z.string(),
    slug: z.string(),
  }),
);

export async function getServiceCategories() {
  return CategoriesSchema.parse(
    await getFullList("service_categories", { sort: "label" }),
  );
}
