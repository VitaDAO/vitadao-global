"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteCurrentUser } from "@/lib/user";

export async function deleteUser() {
  await deleteCurrentUser();
  cookies().delete("privy-token");
  cookies().delete("privy-refresh-token");
  redirect("/");
}
