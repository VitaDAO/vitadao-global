"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteCurrentUser } from "@/lib/user";

export async function deleteUser() {
  await deleteCurrentUser();
  const cookieStore = await cookies();
  cookieStore.delete("privy-token");
  cookieStore.delete("privy-refresh-token");
  redirect("/");
}
