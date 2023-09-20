import { z } from "zod";

const Apple = z.object({
  type: z.literal("apple_oauth"),
});

type Apple = z.infer<typeof Apple>;

const Custom = z.object({
  type: z.literal("custom_oauth"),
});

type Custom = z.infer<typeof Custom>;

const Discord = z.object({
  type: z.literal("discord_oauth"),
});

type Discord = z.infer<typeof Discord>;

const Email = z.object({
  type: z.literal("email"),
});

type Email = z.infer<typeof Email>;

const Github = z.object({
  type: z.literal("github_oauth"),
});

type Github = z.infer<typeof Github>;

const Google = z.object({
  type: z.literal("google_oauth"),
});

type Google = z.infer<typeof Google>;

const Phone = z.object({
  type: z.literal("phone"),
});

type Phone = z.infer<typeof Phone>;

const Twitter = z.object({
  type: z.literal("twitter_oauth"),
});

type Twitter = z.infer<typeof Twitter>;

const Wallet = z.object({
  type: z.literal("wallet"),
  address: z.string(),
});

type Wallet = z.infer<typeof Wallet>;

// This is not a comprehensive schema, just complete enough to meet our
// requirements at the moment.
const LinkedAccount = z.discriminatedUnion("type", [
  Apple,
  Custom,
  Discord,
  Email,
  Github,
  Google,
  Phone,
  Twitter,
  Wallet,
]);

type LinkedAccount = z.infer<typeof LinkedAccount>;

export const PrivyUserSchema = z.object({
  id: z.string(),
  linked_accounts: z.array(LinkedAccount),
});

export function isWallet(account: LinkedAccount): account is Wallet {
  return account.type === "wallet";
}

export async function fetchPrivy(url: string, options: RequestInit = {}) {
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
