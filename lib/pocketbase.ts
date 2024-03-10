import PocketBase, {
  ClientResponseError,
  type CommonOptions,
  type RecordFullListOptions,
} from "pocketbase";
import { cache } from "react";
import { z } from "zod";

const getPocketbaseInstance = cache(async () => {
  const PB_HOSTNAME = z.string().parse(process.env.PB_HOSTNAME);
  const pb = new PocketBase("https://" + PB_HOSTNAME);
  const PB_USERNAME = z.string().parse(process.env.PB_USERNAME);
  const PB_PASSWORD = z.string().parse(process.env.PB_PASSWORD);
  await pb.collection("auth").authWithPassword(PB_USERNAME, PB_PASSWORD, {
    cache: "no-store",
  });
  return pb;
});

export async function getFullList(
  collection: string,
  options?: RecordFullListOptions,
) {
  const pb = await getPocketbaseInstance();
  return pb.collection(collection).getFullList({
    next: { revalidate: 3600 },
    ...options,
  });
}

export async function getFirstListItem(
  collection: string,
  filter: string,
  options?: CommonOptions,
) {
  const pb = await getPocketbaseInstance();
  try {
    return await pb.collection(collection).getFirstListItem(filter, {
      next: { revalidate: 3600 },
      ...options,
    });
  } catch (e) {
    if (e instanceof ClientResponseError && e.status === 404) {
      return null;
    }
    throw e;
  }
}

export async function deleteRecord(
  collection: string,
  id: string,
  options?: CommonOptions,
) {
  const pb = await getPocketbaseInstance();
  return pb.collection(collection).delete(id, {
    cache: "no-store",
    ...options,
  });
}
