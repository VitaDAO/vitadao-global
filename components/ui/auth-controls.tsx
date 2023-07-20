"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import { getUserHandle } from "@/lib/utils";
import Link from "next/link";

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
      <div className="flex items-center justify-between gap-3">
        <span>{getUserHandle(account)}</span>
        <Link
          href="/manage-accounts"
          className="flex items-center justify-center"
        >
          <span className="icon--vita icon--vita--cog" />
        </Link>
      </div>
    );
  }
}
