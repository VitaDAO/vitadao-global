import "server-only";

import { importSPKI, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { z } from "zod";

import { NotAuthenticatedError, NotEnoughVitaError } from "@/lib/errors";
import { getPocketbaseUser } from "@/lib/pocketbase";
import { getPrivyUser, isWallet } from "@/lib/privy";
import { getWalletsBalance } from "@/lib/vita";

// TODO in these functions, consider catching exceptions and returning null in
// those cases rather than bubbling up.

export const getCurrentUserDid = cache(async () => {
  const privyAppPk = z
    .string({ required_error: "Missing Privy public key env var." })
    .parse(process.env.PRIVY_APP_PK);
  const privyAppId = z
    .string({ required_error: "Missing Privy app ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const token = cookies().get("privy-token");

  if (token) {
    const verificationKey = await importSPKI(privyAppPk, "ES256");
    const jwtPayload = await jwtVerify(token.value, verificationKey, {
      issuer: "privy.io",
      audience: privyAppId,
    });
    const JwtPayloadSchema = z.object({
      sub: z.string(),
    });
    const { sub: did } = JwtPayloadSchema.parse(jwtPayload.payload);

    return did;
  }

  return null;
});

export const getCurrentUserVitaBalance = cache(async () => {
  const did = await getCurrentUserDid();

  if (did) {
    const privyUser = await getPrivyUser(did);
    const wallets = privyUser.linked_accounts
      .filter(isWallet)
      .map((a) => a.address);
    const walletsBalance = await getWalletsBalance(wallets);

    const pocketbaseUser = await getPocketbaseUser(did);
    const offsetBalance = pocketbaseUser?.vita_offset ?? 0;

    return walletsBalance + offsetBalance;
  }

  return null;
});

// TODO let's fetch everything about the user once and pass this around?
// - Wallet addresses (Privy) and VITA balances for each (RPC).
// - VITA offset (Pocketbase).
// - Maybe VITA total as a getter that aggregates the previous two.
// - Service access overrides (Pocketbase), although this likely stays unused.
// - Other Privy user data: linked accounts, etc.

// We encapsulate the current user's data in a class with private fields to
// mitigate risk of unintentionally leaking info to the client.
// https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer
export class User {
  #did: string;
  #totalVita: number;

  constructor(did: string, totalVita: number) {
    this.#did = did;
    this.#totalVita = totalVita;
  }

  get did() {
    return this.#did;
  }

  get totalVita() {
    return this.#totalVita;
  }
}

export const getCurrentUser = cache(async () => {
  const did = await getCurrentUserDid();
  const vitaBalance = await getCurrentUserVitaBalance();

  if (did && vitaBalance !== null) {
    return new User(did, vitaBalance);
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
