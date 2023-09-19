"use client";

import { SidebarNavigation, TopNavigation } from "@/components/ui/navigation";
import { useScrollDirectionY } from "@/lib/hooks";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { direction, onScroll, ref } = useScrollDirectionY(50);
  return (
    <>
      <TopNavigation hide={direction === "down"} />
      <div className="flex h-full">
        <SidebarNavigation />
        <main
          ref={ref}
          onScroll={onScroll}
          className="flex-grow overflow-auto pt-[60px] md:pt-0"
        >
          <div className="mx-auto max-w-[1260px] @container/main">
            {children}
            <footer className="px-[20px] py-[30px] text-center text-sm leading-[140%] text-[#BCBCBC] @xl/main:px-[30px] @xl/main:text-right">
              &copy; VitaDAO. All rights reserved.{" "}
              <a
                href="/terms-and-conditions"
                className="underline underline-offset-4"
              >
                Terms and conditions
              </a>{" "}
              -{" "}
              <a
                href="/privacy-policy"
                className="underline underline-offset-4"
              >
                Privacy policy
              </a>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
