import { cn } from "@/lib/utils";

export function Pill({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "rounded-md px-[7px] pb-[3.5px] pt-[5px] text-xs font-medium uppercase leading-none tracking-[1.2px]",
        className,
      )}
      {...rest}
    />
  );
}
