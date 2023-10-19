"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Csr } from "@/lib/browser/csr";

import { useConsent } from "./use-consent";

function UnwrappedConsentDialog() {
  const [consent, setConsent] = useConsent();
  const [open, setOpen] = useState(consent === "unknown");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        className="isolate"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogDescription className="mt-3 text-base text-black">
            Can we use Hotjar and Google Analytics to gather usage data to
            improve this site?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              variant="thin"
              intent="tertiary"
              onClick={() => setConsent("no")}
            >
              No
            </Button>
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <Button variant="thin" onClick={() => setConsent("yes")}>
              Yes
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
