import type { Metadata } from "next";
import Image from "next/image";

import { Providers } from "@/components/providers";
import { AuthControls } from "@/components/ui/auth-controls";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
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
      <body className="font-tt-hoves">
        <nav className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-2 md:hidden">
          <Image
            src="/vitadao-logo.svg"
            alt="VitaDAO Logo"
            width={192}
            height={31}
            priority
            className="inline"
          />
          <Button intent="tertiary">
            <span className="icon--vita icon--vita--shapes" />
          </Button>
        </nav>
        <div className="flex md:h-screen">
          <nav className="hidden h-full w-80 flex-shrink-0 flex-col gap-5 border-r border-gray-400 md:flex">
            <Image
              src="/vitadao-logo.svg"
              alt="VitaDAO Logo"
              width={192}
              height={31}
              priority
              className="p-6"
            />
            <menu className="flex-shrink flex-grow overflow-scroll">
              <li>
                <Link
                  href="/"
                  className="block px-6 py-4"
                  activeClassName="bg-gray-200 text-vita-purple"
                >
                  <span className="icon--vita icon--vita--home mr-3 text-sm" />
                  Home
                </Link>
              </li>
              <li className="block px-6 py-4 text-gray-600">
                <span className="icon--vita icon--vita--logo mr-3 text-sm" />
                My VITA
              </li>
              <li className="block px-6 py-4 text-gray-600">
                <span className="icon--vita icon--vita--gavel mr-3 text-sm" />
                Proposals
              </li>
              <li className="flex items-center justify-between px-6 py-4 text-gray-600">
                <span>
                  <span className="icon--vita icon--vita--bro mr-3 text-sm" />
                  Delegation
                </span>
                <span className="rounded-lg bg-gray-600 px-2 py-1 text-sm uppercase leading-none text-white">
                  coming soon
                </span>
              </li>
              <li className="block px-6 py-4 text-gray-600">
                <span className="icon--vita icon--vita--piechart mr-3 text-sm" />
                Treasury
              </li>
              <li>
                <Link
                  href="/design-system"
                  className="block px-6 py-4"
                  activeClassName="bg-gray-200 text-vita-purple"
                >
                  Design System
                </Link>
              </li>
            </menu>
            <div className="border-t border-gray-400 px-6 py-4">
              <Providers>
                <AuthControls />
              </Providers>
            </div>
          </nav>
          <main className="h-full flex-grow overflow-scroll bg-gray-200 md:p-6">
            <div className="mx-auto max-w-5xl @container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
