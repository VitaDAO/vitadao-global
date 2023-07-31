import { z } from "zod";

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
});

async function fetchSupabase(queryString: string) {
  return fetch(
    `https://${process.env.SUPABASE_ID}.supabase.co/rest/v1/services_view?${queryString}`,
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
    .parse(await fetchSupabase(`slug=eq.${slug}&select=*`));
}
