import { z } from "zod";

import { useLocalStorage } from "@/lib/browser/use-local-storage";

const Consent = z.union([
  z.literal("unknown"),
  z.literal("yes"),
  z.literal("no"),
]);

type Consent = z.infer<typeof Consent>;

export function useConsent() {
  return useLocalStorage<Consent>("tracking-consent", "unknown", Consent);
}
