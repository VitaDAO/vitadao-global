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
      <body className="h-screen bg-gray-200 font-tt-hoves">
        <Navigation />
        <main className="h-full overflow-auto bg-gray-200 md:p-6">
          <div className="mx-auto max-w-5xl @container">{children}</div>
        </main>
      </body>
    </html>
  );
}
