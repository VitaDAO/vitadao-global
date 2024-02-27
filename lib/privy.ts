import { z } from "zod";

// Implementing only partial schemas on a needs basis

const Apple = z.object({
  type: z.literal("apple_oauth"),
  email: z.string(),
});

type Apple = z.infer<typeof Apple>;

const Custom = z.object({
  type: z.literal("custom_auth"),
});

type Custom = z.infer<typeof Custom>;

const Discord = z.object({
  type: z.literal("discord_oauth"),
  email: z.union([z.null(), z.string()]),
  username: z.union([z.null(), z.string()]),
});

type Discord = z.infer<typeof Discord>;

const Email = z.object({
  type: z.literal("email"),
  address: z.string(),
});

type Email = z.infer<typeof Email>;

const Github = z.object({
  type: z.literal("github_oauth"),
  email: z.union([z.null(), z.string()]),
  name: z.union([z.null(), z.string()]),
  username: z.union([z.null(), z.string()]),
});

type Github = z.infer<typeof Github>;

const Google = z.object({
  type: z.literal("google_oauth"),
  email: z.string(),
  name: z.union([z.null(), z.string()]),
});

type Google = z.infer<typeof Google>;

const LinkedIn = z.object({
  type: z.literal("linkedin_oauth"),
  email: z.union([z.null(), z.string()]),
  name: z.union([z.null(), z.string()]),
});

type LinkedIn = z.infer<typeof LinkedIn>;

const Phone = z.object({
  type: z.literal("phone"),
  phoneNumber: z.string(),
});

type Phone = z.infer<typeof Phone>;

const TikTok = z.object({
  type: z.literal("tiktok_oauth"),
  username: z.union([z.null(), z.string()]),
});

type TikTok = z.infer<typeof TikTok>;

const Twitter = z.object({
  type: z.literal("twitter_oauth"),
  name: z.union([z.null(), z.string()]),
  username: z.union([z.null(), z.string()]),
});

type Twitter = z.infer<typeof Twitter>;

const Wallet = z.object({
  type: z.literal("wallet"),
  address: z.string(),
});

type Wallet = z.infer<typeof Wallet>;

const LinkedAccount = z.discriminatedUnion("type", [
  Apple,
  Custom,
  Discord,
  Email,
  Github,
  Google,
  LinkedIn,
  Phone,
  TikTok,
  Twitter,
  Wallet,
]);

type LinkedAccount = z.infer<typeof LinkedAccount>;

const PrivyUserSchema = z.object({
  id: z.string(),
  linked_accounts: z.array(LinkedAccount),
});

export function isWallet(account: LinkedAccount): account is Wallet {
  return account.type === "wallet";
}

async function fetchPrivy(url: string, options: RequestInit = {}) {
  const privyAppId = z
    .string({ required_error: "Missing Privy app ID env var." })
    .parse(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const privyAppSecret = z
    .string({ required_error: "Missing Privy app secret env var." })
    .parse(process.env.PRIVY_APP_SECRET);

  return fetch(url, {
    ...options,
    headers: {
      "privy-app-id": privyAppId,
      Authorization: "Basic " + btoa(`${privyAppId}:${privyAppSecret}`),
      ...options.headers,
    },
  });
}

export async function getPrivyUser(did: string) {
  const res = await fetchPrivy("https://auth.privy.io/api/v1/users/" + did);
  const json = await res.json();
  const user = PrivyUserSchema.parse(json);
  return user;
}

export async function deletePrivyUser(did: string) {
  const res = await fetchPrivy("https://auth.privy.io/api/v1/users/" + did, {
    method: "DELETE",
  });

  if (res.status !== 204) {
    throw new Error("Something failed when attempting to delete user.");
  }
}
