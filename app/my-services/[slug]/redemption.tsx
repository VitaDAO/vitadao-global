"use client";

import { Button } from "@/components/ui/button";
import { type ServiceStandalone } from "@/lib/services";
import { useState } from "react";

interface RedemptionProps {
  service: ServiceStandalone;
}

export function Redemption({ service }: RedemptionProps) {
  const [reveal, setReveal] = useState(false);

  if (reveal && service.redemption_details) {
    switch (service.redemption_details.type) {
      case "promo-code":
        return (
          <p className="mt-[20px] text-center">
            Use promo code{" "}
            <span className="bg-vita-yellow px-2 py-1">
              {service.redemption_details.payload}
            </span>{" "}
            at checkout to get a discount.
          </p>
        );
    }
  }

  return (
    <Button className="mt-[20px] w-full" onClick={() => setReveal(true)}>
      Redeem This Offer
    </Button>
  );
}
