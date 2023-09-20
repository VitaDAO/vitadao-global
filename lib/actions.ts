"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteAuthenticatedUser } from "@/lib/users";

export async function deleteUser() {
  await deleteAuthenticatedUser();
  cookies().delete("privy-token");
  cookies().delete("privy-refresh-token");
  redirect("/");
}
