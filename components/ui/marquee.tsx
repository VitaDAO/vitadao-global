import { cn } from "@/lib/utils";

// TODO delete this component eventually if it remains unused.

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
}

export function Marquee({ className, label, ...rest }: MarqueeProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)} {...rest}>
      <div className="w-max animate-[marquee_10s_linear_infinite] whitespace-pre">
        {new Array(4).fill(null).map((_cur, idx) => (
          <span key={idx} className="ml-0">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
