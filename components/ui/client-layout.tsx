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
          {children}
        </main>
      </div>
    </>
  );
}
