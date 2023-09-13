import { importSPKI, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

import { getFirstListItem } from "@/lib/pocketbase";
import { PrivyUserSchema, isWallet } from "@/lib/privy";
import { getWalletsBalance } from "@/lib/vita";

export async function getUserDidFromCookie() {
  const privyAppPk = z
    .string({ required_error: "Missing Privy public key env var." })
    .parse(process.env.PRIVY_APP_PK);
  const privyAppId = z
    .string({ required_error: "Missing Privy app ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const cookieStore = cookies();
  const privyTokenCookie = cookieStore.get("privy-token");
  const privyToken = z
    .string()
    .nullable()
    .catch(null)
    .parse(privyTokenCookie?.value);

  // TODO consider catching exceptions and returning null in those cases
  // rather than bubling up.
  if (privyToken) {
    const verificationKey = await importSPKI(privyAppPk, "ES256");
    const JwtPayloadSchema = z.object({
      sub: z.string(),
    });
    const { sub: did } = JwtPayloadSchema.parse(
      (
        await jwtVerify(privyToken, verificationKey, {
          issuer: "privy.io",
          audience: privyAppId,
        })
      ).payload,
    );

    return did;
  }

  return null;
}

async function getPrivyUser(did: string) {
  const privyAppId = z
    .string({ required_error: "Missing Privy app ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const privyAppSecret = z
    .string({ required_error: "Missing Privy app ID env var." })
    .parse(process.env.PRIVY_APP_SECRET);

  const res = await fetch("https://auth.privy.io/api/v1/users/" + did, {
    headers: {
      "privy-app-id": privyAppId,
      Authorization: "Basic " + btoa(`${privyAppId}:${privyAppSecret}`),
    },
  });
  const json = await res.json();
  const user = PrivyUserSchema.parse(json);
  return user;
}

const PocketbaseUserSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  did: z.string(),
  id: z.string(),
  updated: z.string(),
  vita_offset: z.number(),
});

async function getPocketbaseUser(did: string) {
  return PocketbaseUserSchema.nullable().parse(
    await getFirstListItem("users", `did = "${did}"`),
  );
}

export async function getUserBalance(did: string) {
  const privyUser = await getPrivyUser(did);
  const wallets = privyUser.linked_accounts
    .filter(isWallet)
    .map((a) => a.address);
  const walletsBalance = await getWalletsBalance(wallets);

  const pocketbaseUser = await getPocketbaseUser(did);
  const offsetBalance = pocketbaseUser?.vita_offset ?? 0;

  return walletsBalance + offsetBalance;
}
