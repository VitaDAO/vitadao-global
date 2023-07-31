import { z } from "zod";

// TODO gate these functions with read access logic

const Service = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  description: z.string(),
  vita_required: z.number(),
  read_access: z.union([
    z.literal("public"),
    z.literal("private"),
    z.literal("vip"),
  ]),
  logo_path: z
    .string()
    .transform(
      (p) =>
        `https://${process.env.SUPABASE_ID}.supabase.co/storage/v1/object/public/services/${p}`
    ),
  image_path: z
    .string()
    .nullable()
    .transform(
      (p) =>
        p &&
        `https://${process.env.SUPABASE_ID}.supabase.co/storage/v1/object/public/services/${p}`
    ),
  slug: z.string(),
  is_featured: z.boolean(),
});

async function fetchSupabase(queryString: string) {
  return fetch(
    `https://${process.env.SUPABASE_ID}.supabase.co/rest/v1/services?${queryString}`,
    {
      headers: {
        apikey: z.string().parse(process.env.SUPABASE_KEY),
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
      },
    }
  ).then((res) => res.json());
}

export async function getServices() {
  return Service.array().parse(await fetchSupabase(""));
}

export async function getServiceBySlug(slug: string) {
  return Service.array()
    .length(1)
    .transform((s) => s[0])
    .parse(await fetchSupabase(`slug=eq.${slug}`));
}

// TODO confirm with product that we'd want this behaviour; we're currently not
// enforcing that only one service in the DB be is_featured true, although we're
// expecting to only feature one single service on the homepage. In the future,
// as different users will have different read access, it might make sense to
// afford featuring different services for each, although then we'll have to
// figure out how to encode the service to feature for highest priviledge users.
// TBD.
export async function getFeaturedService() {
  return Service.array()
    .transform((s) => (s.length > 0 ? s[0] : null))
    .parse(
      await fetchSupabase(`is_featured=is.true`).then((json) => {
        console.log(json);
        return json;
      })
    );
}
