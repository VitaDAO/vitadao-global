// TODO I'm not super happy with the current module breakdown and I think it'd
// be better to go with a domain-split rather than a "technical" split. I.e. not
// having a kitchensink "hooks.ts" file but sprinkling hooks in domain specific
// modules. Will do for now.

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useScrollDirectionY(
  triggerOffset: number = 0,
  scrollToTopOnNavigation: boolean = true,
) {
  const ref = useRef<HTMLElement>(null);

  const scrollOrigin = useRef<number | null>(null);

  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollValue = e.currentTarget.scrollTop;
    if (
      scrollOrigin.current === null ||
      (direction === "up" && scrollValue < scrollOrigin.current) ||
      (direction === "down" && scrollValue > scrollOrigin.current)
    ) {
      scrollOrigin.current = scrollValue;
    } else {
      if (
        (direction === "up" || direction === null) &&
        scrollValue - scrollOrigin.current > triggerOffset
      ) {
        setDirection("down");
        scrollOrigin.current = scrollValue;
      } else if (
        (direction === "down" || direction === null) &&
        scrollValue - scrollOrigin.current < -triggerOffset
      ) {
        setDirection("up");
        scrollOrigin.current = scrollValue;
      }
    }
  };

  // This scroll to top solves issues that I'm having that seem to come from
  // weird ways in which the Next.js router is handling scroll setting on
  // navigation. Not sure if I'm doing something wrong or if it's a bug in
  // Next.js. This is hacky but seems to work for now.
  const pathname = usePathname();
  useEffect(() => {
    scrollToTopOnNavigation && ref.current && ref.current.scrollTo({ top: 0 });
  }, [pathname, scrollToTopOnNavigation]);

  return {
    direction,
    onScroll,
    ref,
  };
}
