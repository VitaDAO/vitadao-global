"use client";

import { useEffect, useState } from "react";

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

function useImageLoadingStatus(src?: string) {
  const [loadingStatus, setLoadingStatus] =
    useState<ImageLoadingStatus>("idle");

  useEffect(() => {
    if (!src) {
      setLoadingStatus("error");
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) return;
      setLoadingStatus(status);
    };

    setLoadingStatus("loading");
    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("error");
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
}

type DisplayAs = "image" | "video" | "fallback";

interface MediaElementProps {
  children: React.ReactNode;
  src: string | undefined;
}

export function MediaElement({ children, src }: MediaElementProps) {
  const [displayAs, setDisplayAs] = useState<DisplayAs>(
    src ? "image" : "fallback"
  );

  const imageStatus = useImageLoadingStatus(src);

  if (displayAs === "image" && imageStatus !== "error") {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        // onError={() => setDisplayAs("video")}
      />
    );
  }

  if (displayAs === "fallback") {
    return <>{children}</>;
  }

  return (
    <video
      src={src}
      autoPlay
      loop
      onError={() => setDisplayAs("fallback")}
      className="h-full w-full object-cover"
    />
  );
}
