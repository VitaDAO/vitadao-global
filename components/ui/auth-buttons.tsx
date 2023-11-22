"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const router = useRouter();
  const { login } = useLogin({ onComplete: router.refresh });
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return (
      <>
        <Button
          intent="tertiary"
          className="w-full animate-pulse text-vita-purple"
          disabled
        >
          Sign up
        </Button>
        <Button
          intent="tertiary"
          className="w-full animate-pulse text-vita-purple"
          disabled
        >
          Log in
        </Button>
      </>
    );
  }

  if (ready && !authenticated) {
    return (
      <>
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
      </>
    );
  }

  return null;
}
