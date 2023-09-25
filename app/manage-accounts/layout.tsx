import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Manage accounts",
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
