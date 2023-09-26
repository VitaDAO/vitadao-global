"use client";

import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AvatarAndHandle } from "./avatar-and-handle";

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

  if (ready && authenticated && user) {
    return (
      <div className="flex h-full w-full items-center gap-3 text-sm">
        <AvatarAndHandle user={user} className="flex-grow" />
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
