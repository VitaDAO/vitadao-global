import PocketBase from "pocketbase";
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
      console.error(e);
      return null;
    }
  },
);
