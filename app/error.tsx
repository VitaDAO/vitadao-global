"use client";

import Image from "next/image";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import vitaPlanet from "@/public/vita-planet.png";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO log error to an error reporting service
    console.error(error);
  }, [error]);

  const message = [
    error.digest && `Reference number: ${error.digest}.`,
    error.message,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-[20px] p-[20px]">
      <Image src={vitaPlanet} alt="" height={287} width={668} />
      <p className="text-center text-h4 font-medium">Something went wrong</p>
      {message && <p className="max-w-2xl">{message}</p>}
      <Button variant="thin" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
