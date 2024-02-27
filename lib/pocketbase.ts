import PocketBase, {
  ClientResponseError,
  type RecordFullListOptions,
  type RecordListOptions,
} from "pocketbase";
import { cache } from "react";
import { z } from "zod";

const getPocketbaseInstance = cache(async () => {
  const PB_HOSTNAME = z.string().parse(process.env.PB_HOSTNAME);
  const pb = new PocketBase("https://" + PB_HOSTNAME);
  const PB_USERNAME = z.string().parse(process.env.PB_USERNAME);
  const PB_PASSWORD = z.string().parse(process.env.PB_PASSWORD);
  await pb.collection("auth").authWithPassword(PB_USERNAME, PB_PASSWORD);
  return pb;
});

export const getFullList = async (
  collection: string,
  options?: RecordFullListOptions,
) => {
  const pb = await getPocketbaseInstance();
  return pb.collection(collection).getFullList(options);
};

export const getFirstListItem = async (
  collection: string,
  filter: string,
  options?: RecordListOptions,
) => {
  const pb = await getPocketbaseInstance();
  try {
    return pb.collection(collection).getFirstListItem(filter, options);
  } catch (e) {
    if (e instanceof ClientResponseError && e.status === 404) {
      // Don't log 404s
      return null;
    }

    console.error(e);
    return null;
  }
};

async function deleteRecord(collection: string, id: string) {
  const pb = await getPocketbaseInstance();
  return pb.collection(collection).delete(id);
}

// TODO migrate user related code below to users module

const pocketbaseUserSchema = z.object({
  did: z.string(),
  id: z.string(),
  vita_offset: z.number(),
});

export async function getPocketbaseUser(did: string) {
  return pocketbaseUserSchema
    .nullable()
    .parse(await getFirstListItem("users", `did = "${did}"`));
}

const redeemOverridesSchema = z.object({
  id: z.string(),
});

export async function deletePocketbaseUser(did: string) {
  // 1. Delete all rows with did from "redeem_overrides" if any exist.
  const redeemOverrides = redeemOverridesSchema
    .array()
    .parse(await getFullList("redeem_overrides", { filter: `did = "${did}"` }));
  for (const override of redeemOverrides) {
    await deleteRecord("redeem_overrides", override.id);
  }

  // 2. Delete did row from "users" if one exists.
  const user = pocketbaseUserSchema
    .nullable()
    .parse(await getFirstListItem("users", `did = "${did}"`));
  if (user) {
    await deleteRecord("users", user.id);
  }
}
