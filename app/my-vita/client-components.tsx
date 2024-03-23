"use client";

import { useLinkAccount, useLogin, usePrivy } from "@privy-io/react-auth";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";
import { cn } from "@/lib/utils";

export function LinkWalletButton({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"button">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { linkWallet } = useLinkAccount({
    onSuccess(_user, linkedAccountType) {
      if (linkedAccountType === "siwe") {
        startTransition(() => {
          router.refresh();
        });
      }
    },
  });

  return (
    <button
      className={cn(
        "font-semibold text-vita-purple underline underline-offset-4",
        isPending &&
          "cursor-not-allowed font-normal text-gray-800 no-underline",
        className,
      )}
      disabled={isPending}
      onClick={linkWallet}
      {...rest}
    >
      {isPending ? (
        <>
          <ReloadIcon className="mr-2 inline-block h-4 w-4 animate-spin" />
          Linking...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function UnlinkWalletButton({
  address,
  disabled = false,
}: {
  address: string;
  disabled?: boolean;
}) {
  const { ready, authenticated, user, unlinkWallet } = usePrivy();
  const router = useRouter();
  const [isUnlinking, startTransition] = useTransition();

  const finalDisabled =
    !ready || !authenticated || !user || isUnlinking || disabled;

  function unlinkAndRefresh() {
    startTransition(() => {
      unlinkWallet(address);
      router.refresh();
    });
  }

  return (
    <button
      disabled={finalDisabled}
      className={cn(
        "text-left font-semibold text-vita-purple underline underline-offset-4 @xl/card:text-right",
        finalDisabled &&
          "cursor-not-allowed font-normal text-gray-800 no-underline",
      )}
      onClick={unlinkAndRefresh}
    >
      {isUnlinking ? (
        <>
          <ReloadIcon className="mr-2 inline-block h-4 w-4 animate-spin" />
          Unlinking...
        </>
      ) : (
        "Unlink"
      )}
    </button>
  );
}

export function PleaseLogIn() {
  const router = useRouter();
  const [isLogingIn, startTransition] = useTransition();
  const { login } = useLogin({
    onComplete(_user, _isNewUser, wasAlreadyAuthenticated, _loginMethod) {
      if (!wasAlreadyAuthenticated) {
        startTransition(() => {
          router.refresh();
        });
      }
    },
  });

  let content = (
    <>
      <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
        Please log in and link a wallet to view your balances.
      </p>
      <div className="flex justify-stretch gap-2">
        <Button
          className="px-[33px] text-base font-medium leading-none text-vita-purple"
          intent="tertiary"
          onClick={login}
        >
          Sign up
        </Button>
        <Button
          className="px-[33px] text-base font-medium leading-none text-vita-purple"
          intent="tertiary"
          onClick={login}
        >
          Log in
        </Button>
      </div>
    </>
  );

  if (isLogingIn) {
    content = <VitadaoSpinner />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] py-[20px]  @xl/main:gap-[30px] @xl/main:py-[30px]">
      {content}
    </div>
  );
}

export function PleaseLinkWallet() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { linkWallet } = useLinkAccount({
    onSuccess(_user, linkedAccountType) {
      if (linkedAccountType === "siwe") {
        startTransition(() => {
          router.refresh();
        });
      }
    },
  });

  let content = (
    <>
      <p className="text-center text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
        Please link a wallet to view your balances.
      </p>
      <Button
        intent="tertiary"
        className={cn(
          "px-[33px] text-base font-medium leading-none text-vita-purple",
        )}
        onClick={linkWallet}
      >
        Link a Wallet
      </Button>
    </>
  );

  if (isPending) {
    content = <VitadaoSpinner />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[20px] py-[20px] @xl/main:gap-[30px] @xl/main:py-[30px]">
      {content}
    </div>
  );
}
