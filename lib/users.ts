import { importSPKI, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

import { deletePocketbaseUser, getPocketbaseUser } from "@/lib/pocketbase";
import { deletePrivyUser, getPrivyUser, isWallet } from "@/lib/privy";
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

// TODO maybe make this getAuthenticatedUserBalance and pick did from cookies
// (requiring verification of valid session) to mitigate risk that this ends up
// used somewhere where someone could query someone else's balance from their
// DID.
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

export async function deleteAuthenticatedUser() {
  const did = await getUserDidFromCookie();

  if (did) {
    await deletePocketbaseUser(did);
    await deletePrivyUser(did);
  }
}
