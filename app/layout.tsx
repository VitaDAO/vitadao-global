import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/ui/client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitaDAO.Global",
  description:
    "The new home for VitaDAO members, providing exclusive services, portfolio management and governance tools to VITA holders.",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="h-[100dvh] overflow-hidden bg-gray-200 font-tt-hoves">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
