"use client";

import Script from "next/script";

import { Csr } from "@/lib/browser/csr";
import { useConsent } from "./use-consent";

interface ScriptWithConsentProps
  extends React.ComponentPropsWithoutRef<typeof Script> {}

function ScriptWithConsent(props: ScriptWithConsentProps) {
  const [consent] = useConsent();

  if (consent === "yes") return <Script {...props} />;

  return null;
}

interface TrackingScriptProps {
  env: string | undefined;
}

export function Hotjar({ env }: TrackingScriptProps) {
  let scriptContent = `console.log("Loaded Hotjar development mock.")`;
  if (env === "production") {
    scriptContent = `console.log("Loaded Hotjar production mock.")`;
  }

  return (
    <Csr>
      <ScriptWithConsent id="hotjar">{scriptContent}</ScriptWithConsent>
    </Csr>
  );
}

export function GoogleAnalytics({ env }: TrackingScriptProps) {
  let scriptContent = `console.log("Loaded Google Analytics development mock.")`;
  if (env === "production") {
    scriptContent = `console.log("Loaded Google Analytics production mock.")`;
  }

  return (
    <Csr>
      <ScriptWithConsent id="google-analytics">
        {scriptContent}
      </ScriptWithConsent>
    </Csr>
  );
}
