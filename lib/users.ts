import { importSPKI, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

import { getFirstListItem } from "@/lib/pocketbase";
import { getWalletsBalance } from "@/lib/vita";

// TODO verify and fix if this breaks when user has linked accounts other than
// email and wallet.

const EmailWithMetadata = z.object({
  type: z.literal("email"),
  address: z.string(),
});

const WalletWithMetadata = z.object({
  type: z.literal("wallet"),
  address: z.string(),
});

const LinkedAccount = z.discriminatedUnion("type", [
  EmailWithMetadata,
  WalletWithMetadata,
]);

const User = z.object({
  id: z.string(),
  linked_accounts: z.array(LinkedAccount),
});

type User = z.infer<typeof User>;

export async function getUser(did: string) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  return fetch("https://auth.privy.io/api/v1/users/" + did, {
    headers: {
      // TODO there's possibly a more elegant way to handle an undefined appId
      "privy-app-id": appId ?? "",
      Authorization: "Basic " + btoa(`${appId}:${appSecret}`),
    },
  })
    .then((res) => res.json())
    .then((json) => User.parse(json));
}

export async function parseAuthToken(authToken: string) {
  const publicKey = z
    .string({ required_error: "Missing Privy public key env var." })
    .parse(process.env.PRIVY_APP_PK);
  const privyId = z
    .string({ required_error: "Missing Privy ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const verificationKey = await importSPKI(publicKey, "ES256");
  return jwtVerify(authToken, verificationKey, {
    issuer: "privy.io",
    audience: privyId,
  });
}

const JwtPayload = z.object({
  sub: z.string(),
});

export async function getUserDidFromAuthToken(authToken: string) {
  const { sub } = JwtPayload.parse((await parseAuthToken(authToken)).payload);
  return sub;
}

export async function getVitaBalance(user: User) {
  const walletAddresses = user.linked_accounts
    .filter((la) => la.type === "wallet")
    .map((wa) => wa.address);

  return getWalletsBalance(walletAddresses);
}

// Takes user object and service ID and returns true or false.
export function hasAccess(user: User, serviceId: string) {}

export async function getUserDid() {
  const publicKey = z
    .string({ required_error: "Missing Privy public key env var." })
    .parse(process.env.PRIVY_APP_PK);
  const privyId = z
    .string({ required_error: "Missing Privy ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const cookieStore = cookies();
  const privyTokenCookie = cookieStore.get("privy-token");
  const privyToken = z
    .string()
    .nullable()
    .catch(null)
    .parse(privyTokenCookie?.value);

  if (privyToken) {
    const verificationKey = await importSPKI(publicKey, "ES256");
    const { sub: did } = JwtPayload.parse(
      (
        await jwtVerify(privyToken, verificationKey, {
          issuer: "privy.io",
          audience: privyId,
        })
      ).payload,
    );

    return did;
  }
  return null;
}

const PocketbaseUser = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  did: z.string(),
  id: z.string(),
  updated: z.string(),
  vita_offset: z.number(),
});

export async function getUserBalance(did: string) {
  const privyUser = await getUser(did);
  const wallets = privyUser.linked_accounts
    .filter((a) => a.type === "wallet")
    .map((a) => a.address);
  const walletsBalance = await getWalletsBalance(wallets);
  const offsetBalance =
    PocketbaseUser.nullable().parse(
      await getFirstListItem("users", `did = "${did}"`),
    )?.vita_offset ?? 0;
  return walletsBalance + offsetBalance;
}
