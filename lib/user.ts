import "server-only";

import { importSPKI, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { z } from "zod";

import { NotAuthenticatedError, NotEnoughVitaError } from "@/lib/errors";
import { deleteRecord, getFirstListItem, getFullList } from "@/lib/pocketbase";
import {
  PrivyUserSchema,
  fetchPrivy,
  isWallet,
  type LinkedAccount,
} from "@/lib/privy";
import { getVitaBalances, type VitaBalance } from "@/lib/vita";

const getCurrentUserDid = cache(async () => {
  const PRIVY_APP_PK = z.string().parse(process.env.PRIVY_APP_PK);
  const PRIVY_APP_ID = z.string().parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const token = cookies().get("privy-token");

  if (token) {
    const verificationKey = await importSPKI(PRIVY_APP_PK, "ES256");
    const jwtPayload = await jwtVerify(token.value, verificationKey, {
      issuer: "privy.io",
      audience: PRIVY_APP_ID,
    });

    return z
      .object({
        sub: z.string(),
      })
      .transform(({ sub }) => sub)
      .parse(jwtPayload.payload);
  }

  return null;
});

const pocketbaseUserSchema = z.object({
  did: z.string(),
  id: z.string(),
  vita_offset: z.number(),
});

async function getPocketbaseUser(did: string) {
  return pocketbaseUserSchema
    .nullable()
    .parse(await getFirstListItem("users", `did = "${did}"`));
}

const redeemOverridesSchema = z.object({
  id: z.string(),
});

async function deletePocketbaseUser(did: string) {
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

async function getPrivyUser(did: string) {
  const res = await fetchPrivy("https://auth.privy.io/api/v1/users/" + did);
  const json = await res.json();
  const user = PrivyUserSchema.parse(json);
  return user;
}

async function deletePrivyUser(did: string) {
  const res = await fetchPrivy("https://auth.privy.io/api/v1/users/" + did, {
    method: "DELETE",
  });

  if (res.status !== 204) {
    throw new Error("Something failed when attempting to delete user.");
  }
}

// We encapsulate the current user's data in a class with private fields to
// mitigate risk of unintentionally leaking info to the client.
// https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer
export class User {
  #did: string;
  #linkedAccounts: LinkedAccount[];
  #vitaBalances: VitaBalance[];
  #vitaOffset: number;

  constructor(
    did: string,
    linkedAccounts: LinkedAccount[],
    vitaBalances: VitaBalance[] = [],
    vitaOffset: number = 0,
  ) {
    this.#did = did;
    this.#linkedAccounts = linkedAccounts;
    this.#vitaBalances = vitaBalances;
    this.#vitaOffset = vitaOffset;
  }

  get did() {
    return this.#did;
  }

  get linkedAccounts() {
    return this.#linkedAccounts;
  }

  get vitaBalances() {
    return this.#vitaBalances;
  }

  get vitaOffset() {
    return this.#vitaOffset;
  }

  get totalVita() {
    return (
      this.#vitaOffset +
      this.#vitaBalances.reduce(
        (acc, [_chain, _address, balance]) => acc + balance,
        0,
      )
    );
  }
}

export const getCurrentUser = cache(async () => {
  const did = await getCurrentUserDid();

  if (did) {
    // TODO chain Privy user request with balance check because I think
    // Pocketbase in series with that sequence is slowing things down.
    const [privyUser, pocketbaseUser] = await Promise.all([
      getPrivyUser(did),
      getPocketbaseUser(did),
    ]);

    const wallets = privyUser.linked_accounts
      .filter(isWallet)
      .map((a) => a.address);
    const vitaBalances = await getVitaBalances(wallets);
    const vitaOffset = pocketbaseUser?.vita_offset ?? 0;

    return new User(did, privyUser.linked_accounts, vitaBalances, vitaOffset);
  }

  return null;
});

export const gate = async (minVita: number = 0) => {
  const currentUser = await getCurrentUser();

  if (currentUser === null) {
    throw new NotAuthenticatedError();
  }

  if (currentUser.totalVita < minVita) {
    throw new NotEnoughVitaError(minVita);
  }

  return currentUser;
};

export async function deleteCurrentUser() {
  const did = await getCurrentUserDid();

  if (did) {
    await deletePocketbaseUser(did);
    await deletePrivyUser(did);
  }
}
