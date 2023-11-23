import Image from "next/image";
import Link from "next/link";

import { AuthButtons } from "@/components/ui/auth-buttons";
import {
  NotAuthenticatedError,
  NotEnoughVitaError,
  NotFoundError,
} from "@/lib/errors";
import vitaPlanet from "@/public/vita-planet.png";

interface ErrorUiProps {
  error: Error;
}

export function ErrorUi({ error }: ErrorUiProps) {
  let content;

  if (error instanceof NotAuthenticatedError) {
    content = (
      <>
        <p className="mb-[20px] text-h4 font-medium">
          You need to log in to view this page.
        </p>
        <div className="mb-[20px] flex w-full max-w-sm flex-col gap-5">
          <AuthButtons />
        </div>
      </>
    );
  } else if (error instanceof NotEnoughVitaError) {
    content = (
      <>
        <p className="mb-[20px] text-h4 font-medium">
          You need at least {error.minVita} VITA to view this page.
        </p>
        <div className="mb-[20px] max-w-sm space-y-3">
          <p className="text-center">
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
      </>
    );
  } else if (error instanceof NotFoundError) {
    content = (
      <>
        <p className="mb-[20px] text-h4 font-medium">Not Found</p>
        <p className="mb-[20px]">Could not find the requested page.</p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-[20px] pt-[90px]">
      <Image
        src={vitaPlanet}
        alt=""
        height={287}
        width={668}
        className="mb-[20px]"
      />
      {content}
      <Link
        href="/"
        className="font-semibold text-vita-purple underline underline-offset-4"
      >
        Return Home
        <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
      </Link>
    </div>
  );
}
