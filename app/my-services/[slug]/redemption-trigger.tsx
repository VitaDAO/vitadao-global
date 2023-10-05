"use client";

import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { type ServiceStandalone } from "@/lib/services";

interface RedemptionTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  did: string | null;
  balance: number;
  service: ServiceStandalone;
}

export function RedemptionTrigger({
  did,
  balance,
  service,
  children,
}: RedemptionTriggerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { login } = useLogin({ onComplete: router.refresh });

  let content;

  if (did === null) {
    content = (
      <div className="space-y-3">
        <p className="text-lg font-semibold">Register or log in</p>
        <p>
          Services are available to VitaDAO members with the required VITA.
          Register, log in and link your existing VITA or buy some more to gain
          access.
        </p>
        <div className="flex w-full justify-stretch gap-2">
          <Button
            intent="tertiary"
            onClick={() => {
              setOpen(false);
              login();
            }}
            className="w-full text-vita-purple"
          >
            Sign up
          </Button>
          <Button
            intent="tertiary"
            onClick={() => {
              setOpen(false);
              login();
            }}
            className="w-full text-vita-purple"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  } else {
    if (balance < service.vita_required) {
      content = (
        <div className="space-y-3">
          <p className="text-lg font-semibold">Buy more VITA</p>
          <p>
            We recommend using CoW Swap or Uniswap to buy VITA for ease of use
            and security.
          </p>
          <div className="flex flex-col gap-5">
            <a
              href="https://cowswap.exchange/#/swap?referral=0xF5307a74d1550739ef81c6488DC5C7a6a53e5Ac2&inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
              target="_blank"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#042B64] px-3 py-2 text-center text-[#CAE9FE]"
            >
              <span className="icon--vita icon--vita--cow-swap mr-2 text-lg" />
              CoW Swap
            </a>
            <a
              href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
              target="_blank"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#FF007A] px-3 py-2 text-center text-white"
            >
              <span className="icon--vita icon--vita--uniswap mr-2 text-lg" />
              Uniswap
            </a>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="space-y-3">
          <p className="text-lg font-semibold">Redeem this offer</p>
          <div
            dangerouslySetInnerHTML={{
              __html: service.redemption_instructions,
            }}
            className="prose text-black"
          />
        </div>
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">{content}</DialogContent>
    </Dialog>
  );
}
