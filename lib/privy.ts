import { z } from "zod";

const Apple = z.object({
  type: z.literal("apple_oauth"),
});

type Apple = z.infer<typeof Apple>;

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
