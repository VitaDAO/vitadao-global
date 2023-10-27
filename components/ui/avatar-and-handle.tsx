import type { User } from "@privy-io/react-auth";

import { cn, getUserHandle } from "@/lib/utils";
import { Avitar } from "./avitar";

interface AvatarAndHandleProps extends React.ComponentPropsWithoutRef<"div"> {
  user: Pick<User, "id" | "linkedAccounts">;
  avatarClassName?: string;
}

export function AvatarAndHandle({
  className,
  user,
  avatarClassName = "",
  ...rest
}: AvatarAndHandleProps) {
  const account = user?.linkedAccounts.at(-1);

  return (
    <div className={cn("flex items-center gap-3", className)} {...rest}>
      <Avitar
        id={user.id}
        className={cn("h-10 w-10 flex-shrink-0 rounded-full", avatarClassName)}
      />
      <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        <span>{account ? getUserHandle(account) : user.id}</span>
      </div>
    </div>
  );
}
