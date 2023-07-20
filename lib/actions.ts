"use server";

import { redirect } from "next/navigation";

// TODO make this more robust with checking that it comes with a legitimate
// authn token from the user that's about to be deleted, as right now, anyone
// could trigger a user deletion just knowing their DID:
// https://docs.privy.io/guide/authorization/backend
export async function deleteUser(formData: FormData) {
  const userId = formData.get("userId");
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (appId) {
    await fetch(`https://auth.privy.io/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        "privy-app-id": appId,
        Authorization: "Basic " + btoa(`${appId}:${appSecret}`),
      },
    });
    redirect("/");
  }
}
