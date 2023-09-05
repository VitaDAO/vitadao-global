import { z } from "zod";

import { getFirstListItem, getFullList } from "@/lib/pocketbase";

const Service = z.object({
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

export type Service = z.infer<typeof Service>;

interface Options {
  sort?: string;
  filter?: string;
}

// TODO gate these functions with read access logic

// TODO possible optimisation:
// https://nextjs.org/docs/app/building-your-application/data-fetching/caching#combining-cache-preload-and-server-only

export const getServices = (options: Options = {}) =>
  getFullList("services", options);

export const getServiceBySlug = (slug: string) =>
  getFirstListItem("services", `slug = "${slug}"`);

export const getFeaturedService = () =>
  getFirstListItem("services", `is_featured = true`);
