"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

import { Button } from "@/components/ui/button";
import vitaPlanet from "@/public/vita-planet.png";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // TODO log error to an error reporting service
    console.error(error);
  }, [error]);

  function refetchAndReset() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

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
      <Button variant="thin" onClick={refetchAndReset}>
        Try again
      </Button>
    </div>
  );
}
