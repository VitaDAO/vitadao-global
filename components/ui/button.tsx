import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full px-5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "",
        secondary: "",
        tertiary: "",
        danger: "border border-red-600 text-red-600",
      },
      variant: {
        default: "h-[52px]",
        thin: "h-[42px]",
        "with-icon": "h-[52px]",
        "with-arrow": "",
        clickthrough: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      variant: "default",
    },
    compoundVariants: [
      {
        intent: "primary",
        variant: ["default", "thin", "with-icon"],
        className: "bg-primary text-primary-foreground hover:bg-primary-hover",
      },
      {
        intent: "secondary",
        variant: ["default", "thin", "with-icon"],
        className:
          "border border-primary text-secondary-foreground hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground",
      },
      {
        intent: "tertiary",
        variant: ["default", "thin", "with-icon"],
        className: "border border-input bg-background hover:bg-gray-200",
      },
      {
        intent: ["primary", "secondary", "tertiary"],
        variant: "with-arrow",
        className:
          "h-[42px] justify-between border border-input bg-background hover:bg-gray-200",
      },
      {
        intent: ["primary", "secondary", "tertiary"],
        variant: "clickthrough",
        className: "border-none bg-none text-primary hover:text-primary-hover",
      },
    ],
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, icon, intent, variant, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ intent, variant, className }))}
        ref={ref}
        {...props}
      >
        <>
          {variant === "with-icon" && icon && (
            <span className={cn("mr-2", icon)} />
          )}
          {children}
          {["with-arrow", "clickthrough"].includes(variant ?? "") && (
            <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[0.5rem]" />
          )}
        </>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
