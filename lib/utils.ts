import type { User } from "@privy-io/react-auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatNumberOptions {
  decimals?: number;
  cutoff?: number;
}

export function formatNumber(
  n: number,
  { decimals, cutoff = 1000 }: FormatNumberOptions = {},
) {
  if (decimals || decimals == 0) {
    return n?.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  if (n >= cutoff) {
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

export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength
    ? text.slice(0, maxLength - 3).trimEnd() + "..."
    : text;
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
    case "custom_auth":
      return "custom auth";
    case "discord_oauth":
      return account.username ?? "Discord";
    case "email":
      return account.address;
    case "github_oauth":
      return account.username ?? "GitHub";
    case "google_oauth":
      return truncateEmail(account.email);
    case "linkedin_oauth":
      return account.name ?? account.email ?? "LinkedIn";
    case "phone":
      return account.number;
    case "tiktok_oauth":
      return account.username ?? "TikTok";
    case "twitter_oauth":
      return account.username ?? "Twitter";
    case "wallet":
      return truncateWallet(account.address);
  }
}

export type NextSearchParams = { [key: string]: string | string[] | undefined };

export function nextToWebSearchParams(nextSearchParams: NextSearchParams) {
  const webSearchParams = new URLSearchParams();

  Object.entries(nextSearchParams).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => webSearchParams.append(name, v));
    } else if (value) {
      webSearchParams.append(name, value);
    }
  });

  return webSearchParams;
}

export function generateHref(baseHref: string, searchParams: URLSearchParams) {
  return searchParams.size > 0
    ? baseHref + "?" + searchParams.toString()
    : baseHref;
}

export function updateSearchParams(
  searchParams: URLSearchParams,
  name: string,
  value: unknown,
) {
  const newSearchParams = new URLSearchParams(searchParams);
  if (value) {
    newSearchParams.set(name, String(value));
  } else {
    newSearchParams.delete(name);
  }
  return newSearchParams;
}
