import type { User } from "@privy-io/react-auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals?: number) {
  if (decimals || decimals == 0) {
    return n?.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  if (n >= 1000) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } else {
    return n?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

function truncateEmail(address: string, maxLength: number = 28) {
  const [user, domain] = address.split("@");
  return [user.slice(0, maxLength - 4 - domain.length), domain].join("...@");
}

// TODO I'm sure we can use something more robust
export function truncateWallet(address: string, digits: number = 4) {
  return [address.slice(0, digits + 2), address.slice(-digits)].join("...");
}

// TODO do something about these type errors
export function getUserHandle(account: User["linkedAccounts"][number]): string {
  switch (account.type) {
    case "apple_oauth":
      return truncateEmail(account.email);
    case "discord_oauth":
      // @ts-expect-error
      return account.username;
    case "email":
      return account.address;
    case "github_oauth":
      // @ts-expect-error
      return account.username;
    case "google_oauth":
      return truncateEmail(account.email);
    case "phone":
      return account.number;
    case "twitter_oauth":
      // @ts-expect-error
      return account.username;
    case "wallet":
      return truncateWallet(account.address);
  }
}
