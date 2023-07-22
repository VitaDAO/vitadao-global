"use client";

import { usePrivy, type User } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

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
    return (
      <div className="mx-auto max-w-5xl space-y-8 p-4 @container">
        Loading...
      </div>
    );
  }

  if (ready && !authenticated) {
    router.push("/");
  }

  if (ready && authenticated && user) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 p-4 @container">
        <div className="mb-12 grid grid-cols-1 items-center gap-x-5 gap-y-3 @xl:grid-cols-[1fr_max-content_max-content]">
          <h1 className="flex-grow text-h2 font-semibold">Manage Accounts</h1>
          <div>Avatar and name</div>
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
          {/* TODO disable unlink button if there's only one linked account, innit. */}
          <p className="mb-4 mt-6 text-sm uppercase tracking-wide">
            Linked accounts
          </p>
          <div className="divide-y divide-[#ECECEC] overflow-hidden rounded-xl bg-white px-7 py-1 @container">
            {user?.linkedAccounts.map((account) => (
              <div
                key={account.type + account.verifiedAt}
                className="grid grid-cols-2 gap-y-3 py-7 @lg:grid-cols-[160px_1fr_max-content]"
              >
                <p className="flex items-center font-bold">
                  <span className={cn(iconClassName[account.type], "mr-2")} />
                  {formatType(account.type)}
                </p>
                <p className="row-start-2 @lg:row-start-auto">
                  {getUserHandle(account)}
                </p>
                <button className="w-max justify-self-end text-vita-purple underline underline-offset-4">
                  Unlink
                </button>
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
  discord_oauth: "icon--logos--discord",
  email: "icon--vita icon--vita--email",
  github_oauth: "icon--logos--github",
  google_oauth: "icon--logos--google",
  phone: "icon--vita icon--vita--phone",
  twitter_oauth: "icon--logos--twitter",
  wallet: "icon--vita icon--vita--wallet",
};
