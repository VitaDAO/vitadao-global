
import { deletePocketbaseUser } from "@/lib/pocketbase";
import { deletePrivyUser } from "@/lib/privy";
import { getCurrentUserDid } from "./auth";

export async function deleteAuthenticatedUser() {
  const did = await getCurrentUserDid();

  if (did) {
    await deletePocketbaseUser(did);
    await deletePrivyUser(did);
  }
}
