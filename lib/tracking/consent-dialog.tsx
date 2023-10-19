"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Csr } from "@/lib/browser/csr";

import { useConsent } from "./use-consent";

function UnwrappedConsentDialog() {
  const [consent, setConsent] = useConsent();
  const [open, setOpen] = useState(consent === "unknown");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed bottom-0 left-[50%] z-50 w-full max-w-md translate-x-[-50%] space-y-[10px] rounded-t-3xl bg-background p-[20px] shadow-[rgba(55,65,81,0.15)_0px_8px_36px] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-bottom-[48%] data-[state=open]:slide-in-from-left-1/2 sm:bottom-[20px] sm:rounded-3xl"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <Dialog.Description className="text-center text-base text-black">
            Can we use Hotjar and Google Analytics to gather usage data to
            improve this site?
          </Dialog.Description>
          <div className="flex gap-[10px]">
            <Button
              variant="thin"
              onClick={() => {
                setConsent("yes");
                setOpen(false);
              }}
              className="grow"
            >
              Yes
            </Button>
            <Button
              variant="thin"
              intent="tertiary"
              onClick={() => {
                setConsent("no");
                setOpen(false);
              }}
              className="grow"
            >
              No
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// TODO confirm that this Csr wrap is necessary and I'm not going crazy. If it
// _is_ necessary, React, seriously, wtf.
export function ConsentDialog() {
  return (
    <Csr>
      <UnwrappedConsentDialog />
    </Csr>
  );
}
