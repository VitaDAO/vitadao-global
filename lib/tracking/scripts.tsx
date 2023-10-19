"use client";

import Script from "next/script";

import { WithConsent } from "./with-consent";

interface TrackingScriptProps {
  env: string | undefined;
}

export function Hotjar({ env }: TrackingScriptProps) {
  if (env === "production") {
    return (
      <WithConsent>
        <Script id="hotjar">{`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:3688552,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}</Script>
      </WithConsent>
    );
  }

  return (
    <WithConsent>
      <Script id="hotjar">{`console.log("Loaded Hotjar development mock.")`}</Script>
    </WithConsent>
  );
}

export function GoogleAnalytics({ env }: TrackingScriptProps) {
  if (env === "production") {
    return (
      <WithConsent>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QXBYNH821G"
        />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-QXBYNH821G');`}
        </Script>
      </WithConsent>
    );
  }

  return (
    <WithConsent>
      <Script id="google-analytics">{`console.log("Loaded Google Analytics development mock.")`}</Script>
    </WithConsent>
  );
}
