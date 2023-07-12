"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrivy, type User } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";

function getDisplayName(user: User) {
  const firstLinkedAccount = user?.linkedAccounts[0];

  if (firstLinkedAccount) {
    switch (firstLinkedAccount.type) {
      case "email":
        return firstLinkedAccount.address;
      default:
        return user.id;
    }
  }
}

interface DisplayNameProps {
  user: User | null;
}

function DisplayName({ user }: DisplayNameProps) {
  if (user) {
    return <span>{getDisplayName(user)}</span>;
  }
}

function Menu() {
  const { logout } = usePrivy();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button intent="tertiary" variant="thin">
          <span className="icon--vita icon--vita--cog" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthControls() {
  const { login, ready, authenticated, user } = usePrivy();

  if (!ready) {
    // TODO better loading state, even better if we could RSC this thing
    return <></>;
  }

  if (ready && !authenticated) {
    return (
      <Button onClick={login} className="w-full">
        Log in
      </Button>
    );
  }

  if (ready && authenticated) {
    return (
      <div className="flex items-center gap-3">
        <DisplayName user={user} />
        <Menu />
      </div>
    );
  }
}
