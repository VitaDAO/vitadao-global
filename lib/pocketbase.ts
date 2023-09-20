import PocketBase, { ClientResponseError } from "pocketbase";
import { z } from "zod";

const BaseRecord = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  expand: z.array(z.record(z.string())).optional(),
});

const pb = new PocketBase("https://" + process.env.PB_HOSTNAME);
pb.autoCancellation(false);

function withAuth<
  T extends (...args: any[]) => Promise<R>,
  R = Awaited<ReturnType<T>>,
>(cb: T) {
  return async (...args: Parameters<T>) => {
    const username = z.string().parse(process.env.PB_USERNAME);
    const password = z.string().parse(process.env.PB_PASSWORD);
    await pb.collection("auth").authWithPassword(username, password);
    const ret = await cb(...args);
    pb.authStore.clear();
    return ret;
  };
}

interface Options {
  sort?: string;
  filter?: string;
  fields?: string;
}

export const getFullList = withAuth(
  <T>(collection: string, options: Options = {}) =>
    pb.collection(collection).getFullList<T>(options),
);

export const getFirstListItem = withAuth(
  async <T>(collection: string, filter: string, options: Options = {}) => {
    try {
      return await pb
        .collection(collection)
        .getFirstListItem<T>(filter, options);
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 404) {
        // Don't log 404s
        return null;
      }

      console.error(e);
      return null;
    }
  },
);

const deleteRecord = withAuth(async (collection: string, id: string) =>
  pb.collection(collection).delete(id),
);

// Non-comprehensive schema, we just need these fields for now.
const PocketbaseUserSchema = z.object({
  did: z.string(),
  id: z.string(),
  vita_offset: z.number(),
});

export async function getPocketbaseUser(did: string) {
  return PocketbaseUserSchema.nullable().parse(
    await getFirstListItem("users", `did = "${did}"`),
  );
}

// Non-comprehensive schema, we just need these fields for now.
const RedeemOverridesSchema = z.object({
  id: z.string(),
});

export async function deletePocketbaseUser(did: string) {
  // 1. Delete all rows with did from "redeem_overrides" if any exist.
  const redeemOverrides = RedeemOverridesSchema.array().parse(
    await getFullList("redeem_overrides", { filter: `did = "${did}"` }),
  );
  for (const record of redeemOverrides) {
    await deleteRecord("redeem_overrides", record.id);
  }

  // 2. Delete did row from "users" if one exists.
  const user = PocketbaseUserSchema.nullable().parse(
    await getFirstListItem("users", `did = "${did}"`),
  );
  if (user) {
    await deleteRecord("users", user.id);
  }
}
