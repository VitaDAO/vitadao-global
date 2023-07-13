"use client";

import Image from "next/image";

import { Providers } from "@/components/providers";
import { AuthControls } from "@/components/ui/auth-controls";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

interface MenuCardProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

function MenuCard({ href, children, className }: MenuCardProps) {
  const finalClassName = cn(
    "flex h-full flex-col justify-between rounded-xl bg-gray-400 p-6 sm:text-lg",
    className
  );

  if (href) {
    return (
      <Link href={href}>
        <div className={finalClassName}>{children}</div>
      </Link>
    );
  }

  return <div className={finalClassName}>{children}</div>;
}

export function Navigation() {
  return (
    <>
      <nav className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-2 md:hidden">
        <Image
          src="/vitadao-logo.svg"
          alt="VitaDAO Logo"
          width={192}
          height={31}
          priority
          className="inline"
        />
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button intent="tertiary">
              <span className="icon--vita icon--vita--shapes" />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="w-screen shadow-none">
              <menu className="grid h-[calc(100vh_-_60px)] grid-cols-2 grid-rows-4 gap-2 bg-white p-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-10 data-[side=left]:slide-in-from-right-10 data-[side=right]:slide-in-from-left-10 data-[side=top]:slide-in-from-bottom-10">
                <MenuCard href="/">
                  <span className="icon--vita icon--vita--home mr-3 text-lg text-gray-600" />
                  Home
                </MenuCard>
                <MenuCard>
                  <span className="icon--vita icon--vita--logo mr-3 text-lg text-gray-600" />
                  My VITA
                </MenuCard>
                <MenuCard>
                  <span className="icon--vita icon--vita--gavel mr-3 text-lg text-gray-600" />
                  Proposals
                </MenuCard>
                <MenuCard>
                  <span className="icon--vita icon--vita--bro mr-3 text-lg text-gray-600" />
                  Delegation
                </MenuCard>
                <MenuCard>
                  <span className="icon--vita icon--vita--piechart mr-3 text-lg text-gray-600" />
                  Treasury
                </MenuCard>
                <MenuCard href="/design-system" className="flex justify-end">
                  Design System
                </MenuCard>
                <MenuCard className="col-span-2 flex items-center justify-center">
                  Something goes here
                </MenuCard>
              </menu>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </nav>
      <nav className="float-left hidden h-screen w-80 flex-col justify-between border-r border-gray-400 bg-white md:flex">
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
    </>
  );
}
