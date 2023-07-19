"use client";

import { usePrivy, type User } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUserHandle } from "@/lib/utils";

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

  if (ready && authenticated) {
    return (
      <>
        <div className="space-y-5 p-4 md:p-0">
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
            <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
              Your linked accounts
            </p>
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
            <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
              Link new account
            </p>
            <div className="flex flex-wrap gap-5 rounded-xl bg-white p-5">
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkWallet}
              >
                Wallet
              </Button>
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkEmail}
              >
                Email
              </Button>
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkGoogle}
              >
                Google
              </Button>
              {/* TODO re-enable Twitter if the mobile authn problems get fixed */}
              {/* <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkTwitter}
              >
                Twitter
              </Button> */}
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkDiscord}
              >
                Discord
              </Button>
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkGithub}
              >
                Github
              </Button>
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkApple}
              >
                Apple
              </Button>
              <Button
                intent="secondary"
                variant="thin"
                onClick={privy.linkPhone}
              >
                Phone
              </Button>
            </div>
          </div>
        </div>
      </>
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
