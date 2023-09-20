"use server";

import { redirect } from "next/navigation";

import { deleteAuthenticatedUser } from "@/lib/users";

export async function deleteUser() {
  await deleteAuthenticatedUser();
  redirect("/");
}
