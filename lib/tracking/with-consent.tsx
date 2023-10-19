"use client";

import { Csr } from "@/lib/browser/csr";

import { useConsent } from "./use-consent";

interface WithConsentProps {
  children: React.ReactNode;
}

function UnwrappedWithConsent({ children }: WithConsentProps) {
  const [consent] = useConsent();

  if (consent === "yes") return <>{children}</>;

  return null;
}

export function WithConsent({ children }: WithConsentProps) {
  return (
    <Csr>
      <UnwrappedWithConsent>{children}</UnwrappedWithConsent>
    </Csr>
  );
}
