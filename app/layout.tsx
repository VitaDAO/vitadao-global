import type { Metadata } from "next";

import { Navigation } from "@/components/ui/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitaDAO.Global",
  description:
    "The new home for VitaDAO members, providing exclusive services, portfolio management and governance tools to VITA holders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-[100dvh] flex-col overflow-hidden bg-gray-200 font-tt-hoves md:flex-row">
        <Navigation />
        <main className="flex-grow overflow-auto md:p-4">
          <div className="mx-auto max-w-5xl @container">{children}</div>
        </main>
      </body>
    </html>
  );
}
