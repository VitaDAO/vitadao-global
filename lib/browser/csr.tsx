"use client";

import { useEffect, useState } from "react";

interface CsrProps {
  children: React.ReactNode;
}

export function Csr({ children }: CsrProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (window !== undefined) setIsClient(true);
  }, []);

  if (isClient) {
    return <>{children}</>;
  }

  return null;
}
