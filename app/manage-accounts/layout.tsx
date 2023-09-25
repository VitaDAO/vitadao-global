import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage accounts",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
