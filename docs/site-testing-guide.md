# Site testing guide

Here's a non-comprehensive list of things to test before deploying a new
version.

## Basic navigation and rendering

Navigation:

- [ ] Test general site navigation on narrow screen (mobile, less than 768px)
      using the topbar menu modal navigation.
- [ ] Test general site navigation on wide screen (desktop) using the left
      sidebar.

Home (`/`):

- [ ] Check rendering at different widths.
- [ ] Visit [Coingecko](https://www.coingecko.com/en/coins/vitadao) and check
      that the VITA stats block is displaying a similar price. Circulating
      supply and market cap can differ as I believe the amounts on Coingecko
      might be outdated.
- [ ] Visit [vote.vitadao.com](https://vote.vitadao.com) and check that the
      latest proposals are being displayed.

My Services (`/my-services`):

- [ ] Check rendering at different widths.

My VITA (`/my-vita`):

- [ ] Check rendering at different widths.

Proposals (`/proposals`):

- [ ] Check rendering at different widths.
- [ ] Make sure pagination works.
- [ ] Visit [vote.vitadao.com](https://vote.vitadao.com) and check that the
      latest proposals are being displayed.

Treasury (`/treasury`):

- [ ] Check rendering at different widths.
- [ ] As a basic test of data freshness, go to [vitadao.eth's
      holdings](https://etherscan.io/tokenholdings?a=0xF5307a74d1550739ef81c6488DC5C7a6a53e5Ac2)
      view on Etherscan and check that the main asset balances and prices are
      close.

Terms and conditions (`/terms-and-conditions`):

- [ ] Check rendering at different widths.

Privacy policy (`/privacy-policy`):

- [ ] Check rendering at different widths.

## Sign up, login and account management

Although we differentiate between sign up and login on the site, these two
actions are the same under the hood – Privy doesn't make a distinction – a sign
up happens automatically whenever a user logs in for the first time.

Sign up:

- [ ] Create a new user. If you already have an existing user, you can either
      delete it and start again or you can likely sign up without an extra email
      address by
      [subaddressing](https://en.wikipedia.org/wiki/Email_address#Sub-addressing)
      your usual one, something like `username+tag@example.com`. Your email
      provider probably supports it.

Log in entry points:

- [ ] Log in from the sidebar on wide screens.
- [ ] Log in from the topbar menu modal on narrow screens.
- [ ] Log in from My VITA (`/my-vita`).
- [ ] Log in from the dialog triggered from a standalone service page
      (`/my-services/<service-slug>`).

Log in methods:

- [ ] Log in using an email address.
- [ ] Log in using a wallet address.
- [ ] Log in using some oauth 3rd party service (Discord, GitHub, Gmail, etc.)

Log out:

- [ ] Log out from Manage accounts (`/manage-accounts`) and navigate to validate
      that the site now reflects data that would only be viewable as a logged
      out user.

Manage accounts:

- [ ] Try linking and unlinking several different accounts from Manage accounts
      (`/manage-accounts`).

Delete user:

- [ ] Delete the user from Manage accounts (`/manage-accounts`). This action
      should log you out and all of your user data should be deleted from our
      backend. If you log back in with the same email/wallet, you'll find that
      all the accounts that were linked are no longer there. You'll also notice
      your user will get a new blockie avatar, as a new user with a new ID will
      have been created.

## VITA indexing and service access

VITA indexing:

- [ ] Before linking any wallets, go to My VITA (`/my-vita`) and confirm that
      you get a prompt to link a wallet.
- [ ] After linking one or several wallets, the VITA balances of those wallets
      should appear on My VITA (`/my-vita`).

Service redemption:

- [ ] If you have enough VITA to redeem one or several services, try going
      through the redemption flow.
