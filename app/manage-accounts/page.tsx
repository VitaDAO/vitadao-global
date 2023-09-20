"use client";

import { usePrivy, type User } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { AvatarAndHandle } from "@/components/ui/avatar-and-handle";
import { Button } from "@/components/ui/button";
import { cn, getUserHandle } from "@/lib/utils";
import Link from "next/link";
import { DeleteButton } from "./delete-button";

// TODO would be cool to make this file a RSC if we figure that out.

// TODO this should probably just redirect to Home if user's not logged in,
// possibly no point in just adding another login UI here in that case.

export default function Page() {
  const router = useRouter();
  const { ready, authenticated, user, logout, ...privy } = usePrivy();

  if (!ready) {
    // TODO better loading UI, maybe improve with RSC, maybe Suspense
    return <p>Loading...</p>;
  }

  if (ready && !authenticated) {
    router.push("/");
  }

  if (ready && authenticated && user) {
    const linkedAccountsCount = user.linkedAccounts.length;

    return (
      <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
        <div className="mb-12 grid grid-cols-1 items-center gap-x-[30px] gap-y-[20px] @3xl/main:grid-cols-[1fr_max-content_max-content]">
          <h1 className="mb-[10px] text-h2 font-medium">Manage accounts</h1>
          <AvatarAndHandle user={user} avatarClassName="h-8 w-8" />
          <div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-vita-purple underline underline-offset-4"
            >
              <span className="icon--vita icon--vita--exit" />
              Logout
            </button>
          </div>
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm uppercase tracking-wide">
            Linked accounts
          </p>
          <div className="divide-y divide-[#ECECEC] overflow-hidden rounded-xl bg-white px-7 py-1 @container/table">
            {user?.linkedAccounts.map((account) => (
              <div
                key={account.type + account.verifiedAt}
                className="grid grid-cols-2 gap-y-3 py-7 @lg/table:grid-cols-[160px_1fr_max-content]"
              >
                <p className="flex items-center font-bold">
                  <span className={cn(iconClassName[account.type], "mr-2")} />
                  {formatType(account.type)}
                </p>
                <p className="row-start-2 @lg/table:row-start-auto">
                  {getUserHandle(account)}
                </p>
                <UnlinkButton
                  account={account}
                  disabled={linkedAccountsCount <= 1}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm uppercase tracking-wide">
            Link a new account
          </p>
          <div className="flex flex-wrap gap-5 rounded-xl bg-white p-5">
            <Button intent="tertiary" variant="thin" onClick={privy.linkWallet}>
              <span className="icon--vita icon--vita--wallet mr-2" />
              Wallet
            </Button>
            {/* TODO maybe notify user that only one linked email is possible, in case they're wondering */}
            {!user?.email && (
              <Button
                intent="tertiary"
                variant="thin"
                onClick={privy.linkEmail}
              >
                <span className="icon--vita icon--vita--email mr-2" />
                Email
              </Button>
            )}
            <Button intent="tertiary" variant="thin" onClick={privy.linkGoogle}>
              <span className="icon--logos--google mr-2" />
              Google
            </Button>
            {/* TODO re-enable Twitter if the mobile authn problems get fixed */}
            {/* <Button
              intent="tertiary"
              variant="thin"
              onClick={privy.linkTwitter}
            >
              <span className="icon--logos--twitter mr-2" />
              Twitter
            </Button> */}
            <Button
              intent="tertiary"
              variant="thin"
              onClick={privy.linkDiscord}
            >
              <span className="icon--logos--discord mr-2" />
              Discord
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkGithub}>
              <span className="icon--logos--github mr-2" />
              Github
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkApple}>
              <span className="icon--logos--apple mr-2" />
              Apple
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkPhone}>
              <span className="icon--vita icon--vita--phone mr-2" />
              Phone
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm uppercase tracking-wide">
            Delete your account
          </p>
          <DeleteButton userId={user.id} />
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm uppercase tracking-wide">
            Terms and privacy
          </p>
          <ul>
            <li>
              <Link
                href="/terms-and-conditions"
                className="underline underline-offset-4"
              >
                Terms and conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4"
              >
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type AccountType = User["linkedAccounts"][number]["type"];

function formatType(rawType: AccountType) {
  const [label] = rawType.split("_");
  return capitalize(label);
}

const iconClassName: Record<AccountType, string> = {
  apple_oauth: "icon--logos--apple",
  custom_auth: "icon--vita--asterisk",
  discord_oauth: "icon--logos--discord",
  email: "icon--vita icon--vita--email",
  github_oauth: "icon--logos--github",
  google_oauth: "icon--logos--google",
  phone: "icon--vita icon--vita--phone",
  twitter_oauth: "icon--logos--twitter",
  wallet: "icon--vita icon--vita--wallet",
};

interface UnlinkButtonProps {
  account: User["linkedAccounts"][number];
  disabled?: boolean;
}

function UnlinkButton({ account, disabled = false }: UnlinkButtonProps) {
  const {
    ready,
    authenticated,
    unlinkApple,
    unlinkDiscord,
    unlinkEmail,
    unlinkGithub,
    unlinkGoogle,
    unlinkPhone,
    unlinkTwitter,
    unlinkWallet,
  } = usePrivy();

  if (ready && authenticated) {
    let onClick = () => {};

    if (!disabled) {
      switch (account.type) {
        case "apple_oauth":
          onClick = () => unlinkApple(account.subject);
          break;
        case "discord_oauth":
          onClick = () => unlinkDiscord(account.subject);
          break;
        case "email":
          onClick = () => unlinkEmail(account.address);
          break;
        case "github_oauth":
          onClick = () => unlinkGithub(account.subject);
          break;
        case "google_oauth":
          onClick = () => unlinkGoogle(account.subject);
          break;
        case "phone":
          onClick = () => unlinkPhone(account.number);
          break;
        case "twitter_oauth":
          onClick = () => unlinkTwitter(account.subject);
          break;
        case "wallet":
          onClick = () => unlinkWallet(account.address);
          break;
      }
    }

    return (
      <button
        className={cn(
          "w-max justify-self-end text-vita-purple underline underline-offset-4",
          disabled && "cursor-not-allowed text-gray-800 no-underline",
        )}
        onClick={onClick}
      >
        Disconnect
      </button>
    );
  }

  return null;
}
