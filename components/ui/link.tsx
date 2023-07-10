"use client";

import { cn } from "@/lib/utils";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  activeClassName?: string;
}

export function Link({ activeClassName, className, href, ...rest }: LinkProps) {
  const pathname = usePathname();
  return (
    <NextLink
      className={cn(className, href === pathname && activeClassName)}
      href={href}
      {...rest}
    />
  );
}
