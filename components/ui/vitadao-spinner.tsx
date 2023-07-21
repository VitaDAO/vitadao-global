"use client";

import { useEffect, useState } from "react";

// TODO I don't get the lottie file pattern, I'd rather avoid all this ceremony
// and just load a cached animated SVG. Will look into it, maybe
// https://glaxnimate.mattbas.org/manual/formats/ can help with this. At the
// very least we could look into using Lottie Light, which I assume would be
// better on bundles: https://github.com/airbnb/lottie-web/wiki/Lottie-Light

export function VitadaoSpinner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@lottiefiles/lottie-player");
      setIsClient(true);
    }
  }, []);

  if (isClient) {
    return (
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="/vitadao-spinner.json"
        class="w-32"
      />
    );
  }

  return null;
}
