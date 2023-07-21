"use client";

import { usePrivy, type User } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUserHandle } from "@/lib/utils";
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
    return <>Loading...</>;
  }

  if (ready && !authenticated) {
    router.push("/");
  }

  if (ready && authenticated && user) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
        <h1 className="text-h2 font-semibold">Manage Accounts</h1>
        <div>
          <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
            Logout
          </p>
          <Button variant="thin" onClick={logout}>
            Logout
          </Button>
        </div>
        <div>
          {/* TODO disable unlink button if there's only one linked account, innit. */}
          <p className="mb-4 mt-6 uppercase tracking-wide">Linked accounts</p>
          <div className="overflow-hidden rounded-xl bg-white">
            {user?.linkedAccounts.map((account) => (
              <div
                key={account.type + account.verifiedAt}
                className="flex items-center justify-between p-5 hover:bg-gray-400"
              >
                <div>
                  <p>{formatType(account.type)}</p>
                  <p className="font-bold">{getUserHandle(account)}</p>
                </div>
                <Button intent="secondary" variant="thin">
                  Unlink
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 mt-6 uppercase tracking-wide">
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
              <span className="i-logos-google-icon mr-2" />
              Google
            </Button>
            {/* TODO re-enable Twitter if the mobile authn problems get fixed */}
            {/* <Button
                intent="tertiary"
                variant="thin"
                onClick={privy.linkTwitter}
              >
                Twitter
              </Button> */}
            <Button
              intent="tertiary"
              variant="thin"
              onClick={privy.linkDiscord}
            >
              <span className="i-logos-discord-icon mr-2" />
              Discord
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkGithub}>
              <span className="i-logos-github-icon mr-2" />
              Github
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkApple}>
              <span className="i-logos-apple mr-2" />
              Apple
            </Button>
            <Button intent="tertiary" variant="thin" onClick={privy.linkPhone}>
              <span className="icon--vita icon--vita--phone mr-2" />
              Phone
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
            Delete your account
          </p>
          <DeleteButton userId={user.id} />
        </div>
        <div>
          <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
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

function formatType(rawType: User["linkedAccounts"][number]["type"]) {
  const [label] = rawType.split("_");
  return capitalize(label);
}
