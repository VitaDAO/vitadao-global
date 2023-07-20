"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import { getUserHandle } from "@/lib/utils";
import Link from "next/link";

function Avatar() {
  return <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-400" />;
}

export function AuthControls() {
  const { login, ready, authenticated, user } = usePrivy();

  if (!ready) {
    // TODO better loading state, even better if we could RSC this thing
    return <p>Loading...</p>;
  }

  if (ready && !authenticated) {
    return (
      <div className="flex w-full justify-stretch gap-2">
        <Button
          intent="tertiary"
          onClick={login}
          className="w-full text-vita-purple"
        >
          Sign up
        </Button>
        <Button
          intent="tertiary"
          onClick={login}
          className="w-full text-vita-purple"
        >
          Log in
        </Button>
      </div>
    );
  }

  const account = user?.linkedAccounts.at(-1);
  if (ready && authenticated && account) {
    return (
      <div className="flex h-full w-full items-center gap-3 text-sm">
        <Avatar />
        <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{getUserHandle(account)}</span>
        </div>
        <Link
          href="/manage-accounts"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-600"
        >
          <span className="icon--vita icon--vita--cog" />
        </Link>
      </div>
    );
  }
}
