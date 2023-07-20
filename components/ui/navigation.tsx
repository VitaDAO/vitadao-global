"use client";

import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import { useState } from "react";

import { AuthControls } from "@/components/ui/auth-controls";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

interface MenuCardProps extends React.ComponentPropsWithoutRef<"div"> {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

function MenuCard({ href, children, className, ...rest }: MenuCardProps) {
  const finalClassName = cn(
    "flex h-full flex-col justify-end gap-2 rounded-3xl border border-[#ECECEC] bg-white p-5 sm:text-lg",
    className
  );

  if (href) {
    return (
      <Link href={href}>
        <div className={finalClassName} {...rest}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <div className={finalClassName} {...rest}>
      {children}
    </div>
  );
}

// TODO figure out what to do with scroll on page transitions, currently seems
// weird

export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Popover.Root open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
        <Popover.Anchor asChild>
          <nav className="sticky top-0 z-10 flex items-center justify-between bg-white p-2 pl-3 md:hidden">
            <Image
              src="/vitadao-logo.svg"
              alt="VitaDAO Logo"
              width={192}
              height={31}
              priority
              className="inline max-h-[28px] w-auto"
            />
            <Popover.Trigger asChild>
              <Button
                intent="tertiary"
                className={cn(
                  "h-10 w-10 p-0 hover:bg-transparent",
                  open && " border-vita-purple text-vita-purple"
                )}
              >
                <span className="icon--vita icon--vita--shapes" />
              </Button>
            </Popover.Trigger>
          </nav>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content className="flex h-[calc(100dvh_-_56px)] w-screen flex-col bg-white shadow-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-10 data-[side=left]:slide-in-from-right-10 data-[side=right]:slide-in-from-left-10 data-[side=top]:slide-in-from-bottom-10 md:hidden">
            <div className="grid flex-grow grid-cols-2 grid-rows-3 gap-2 px-2 py-3">
              <MenuCard href="/" onClick={() => setOpen(false)}>
                <span className="icon--vita icon--vita--home mr-3 text-lg text-vita-purple" />
                Home
              </MenuCard>
              <MenuCard href="/my-services" onClick={() => setOpen(false)}>
                <span className="icon--vita icon--vita--bell mr-3 text-lg text-vita-purple" />
                My Services
              </MenuCard>
              <MenuCard href="/my-vita" onClick={() => setOpen(false)}>
                <span className="icon--vita icon--vita--logo mr-3 text-lg text-vita-purple" />
                My VITA
              </MenuCard>
              <MenuCard href="/proposals" onClick={() => setOpen(false)}>
                <span className="icon--vita icon--vita--gavel mr-3 text-lg text-vita-purple" />
                Proposals
              </MenuCard>
              <MenuCard href="/treasury" onClick={() => setOpen(false)}>
                <span className="icon--vita icon--vita--piechart mr-3 text-lg text-vita-purple" />
                Treasury
              </MenuCard>
              <MenuCard className="relative overflow-hidden text-gray-600">
                <span className="icon--vita icon--vita--bro mr-3 text-lg text-gray-600" />
                Delegation
                <div className="absolute left-0 top-0 h-full w-full text-sm">
                  <div className="absolute right-[-38px] top-[28px] rotate-[30deg] transform whitespace-nowrap bg-[#D9D9D9] px-10 text-center uppercase tracking-widest text-white">
                    Coming soon
                  </div>
                </div>
              </MenuCard>
            </div>
            <div
              className="min-h-[81px] border-t border-[#ECECEC] px-2 py-3"
              onClick={() => setOpen(false)}
            >
              <AuthControls />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
          <li>
            <Link
              href="/my-services"
              className="block px-6 py-4"
              activeClassName="bg-gray-200 text-vita-purple"
            >
              <span className="icon--vita icon--vita--bell mr-3 text-sm" />
              My Services
            </Link>
          </li>
          <li>
            <Link
              href="/my-vita"
              className="block px-6 py-4"
              activeClassName="bg-gray-200 text-vita-purple"
            >
              <span className="icon--vita icon--vita--logo mr-3 text-sm" />
              My VITA
            </Link>
          </li>
          <li>
            <Link
              href="/proposals"
              className="block px-6 py-4"
              activeClassName="bg-gray-200 text-vita-purple"
            >
              <span className="icon--vita icon--vita--gavel mr-3 text-sm" />
              Proposals
            </Link>
          </li>
          <li>
            <Link
              href="/treasury"
              className="block px-6 py-4"
              activeClassName="bg-gray-200 text-vita-purple"
            >
              <span className="icon--vita icon--vita--piechart mr-3 text-sm" />
              Treasury
            </Link>
          </li>
          <li className="flex items-center justify-between px-6 py-4 text-gray-600">
            <span>
              <span className="icon--vita icon--vita--bro mr-3 text-sm" />
              Delegation
            </span>
            <span className="rounded-lg bg-gray-200 px-2 py-1 text-sm uppercase leading-none">
              coming soon
            </span>
          </li>
        </menu>
        <div className="border-t border-gray-400 px-6 py-4">
          <AuthControls />
        </div>
      </nav>
    </>
  );
}
