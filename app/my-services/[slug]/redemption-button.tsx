import { AuthControls } from "@/components/ui/auth-controls";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { type ServiceStandalone } from "@/lib/services";
import { getUserBalance, getUserDidFromCookie } from "@/lib/users";
import { cn } from "@/lib/utils";

interface RedemptionButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  service: ServiceStandalone;
}

export async function RedemptionButton({
  service,
  className,
  ...rest
}: RedemptionButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(className)} {...rest}>
          Redeem This Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RedemptionModalContent service={service} />
      </DialogContent>
    </Dialog>
  );
}

interface RedemptionModalContentProps {
  service: ServiceStandalone;
}

async function RedemptionModalContent({
  service,
}: RedemptionModalContentProps) {
  // 1. Logged out => log in
  const did = await getUserDidFromCookie();
  if (did === null) {
    return (
      <div className="space-y-5 p-[20px] @xl/main:p-[30px]">
        <p className="text-lg font-medium">Register and log in</p>
        <p>
          Services are available to VitaDAO members with the required VITA.
          Register, log in and link your existing VITA or buy some more to gain
          access.
        </p>
        <AuthControls />
      </div>
    );
  }

  // 2. Logged in no VITA => buy moar
  const balance = await getUserBalance(did);
  if (balance < service.vita_required) {
    return (
      <div className="space-y-5 p-[20px] @xl/main:p-[30px]">
        <p className="text-lg font-medium">Buy more VITA</p>
        <p>
          We recommend using CoW Swap or Uniswap to buy VITA for ease of use and
          security.
        </p>
        <div className="flex flex-col gap-5">
          <a
            href="https://cowswap.exchange/#/swap?referral=0xF5307a74d1550739ef81c6488DC5C7a6a53e5Ac2&inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
            target="_blank"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#042B64] px-3 py-2 text-center text-[#CAE9FE]"
          >
            <span className="icon--vita icon--vita--cow-swap mr-2 text-lg" />
            CoW Swap
          </a>
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321&chain=mainnet"
            target="_blank"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#FF007A] px-3 py-2 text-center text-white"
          >
            <span className="icon--vita icon--vita--uniswap mr-2 text-lg" />
            Uniswap
          </a>
        </div>
      </div>
    );
  }

  // 3. Logged in yes VITA => redeem instructions from DB
  return (
    <div className="space-y-5 p-[20px] @xl/main:p-[30px]">
      <p className="text-lg font-medium">Redeem this offer</p>
      <div
        dangerouslySetInnerHTML={{ __html: service.redemption_instructions }}
        className="prose"
      />
    </div>
  );
}
