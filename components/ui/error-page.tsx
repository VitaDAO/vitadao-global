"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import vitaPlanet from "@/public/vita-planet.png";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-[20px] pt-[90px]">
      <Image
        src={vitaPlanet}
        alt=""
        height={287}
        width={668}
        className="mb-[20px]"
      />
      <h2 className="text-h4 font-medium">{error.name}</h2>
      <p className="mb-[20px]">{error.message}</p>
      <Button variant="thin" onClick={() => reset()} className="mb-[20px]">
        Try again
      </Button>
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
