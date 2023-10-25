"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function HomeAuthControls() {
  const router = useRouter();
  const { login } = useLogin({ onComplete: router.refresh });
  const { ready, authenticated, user } = usePrivy();

  if (ready && !authenticated) {
    return (
      <div className="mt-[28px] flex flex-col justify-center gap-[18px] @sm/main:flex-row @xl/main:justify-start">
        <Button onClick={login} className="min-w-[137px]">
          Sign up
        </Button>
        <Button
          onClick={login}
          className="min-w-[137px] border border-white bg-transparent hover:bg-[#222]"
        >
          Log in
        </Button>
      </div>
    );
  }

  return null;
}
