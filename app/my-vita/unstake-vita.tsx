import { cn } from "@/lib/utils";

// TODO implement this check so that only users with some staked VITA are told
// to unstake.
async function getStakedBalance() {
  return 42;
}

interface UnstakeVitaProps extends React.ComponentPropsWithoutRef<"div"> {}

export async function UnstakeVita({ className, ...rest }: UnstakeVitaProps) {
  const stakedBalance = await getStakedBalance();

  if (stakedBalance > 0) {
    return (
      <div
        className={cn(
          "flex gap-[20px] rounded-xl bg-white p-[20px] @xl/main:gap-[30px] @xl/main:p-[30px]",
          className,
        )}
        {...rest}
      >
        <div className="flex-grow">
          <p className="mb-[10px] text-[20px] font-semibold leading-[120%] tracking-[-0.2px]">
            Un-Stake your VITA
          </p>
          <p className="mb-[20px] max-w-[770px] text-base leading-[140%]">
            If you have some VITA staked in the old Raphael staking contract
            (used for governance before we moved to Snapshot), you can unstake
            and link your VITA to your account to get access to more services.
          </p>
          <a
            href="https://gov.vitadao.com/t/how-to-unstake-vita-to-use-your-tokens-on-snapshot/491"
            target="_blank"
            className="text-base font-semibold leading-normal text-vita-purple underline underline-offset-4"
          >
            Un-Stake My VITA
            <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
          </a>
        </div>
        <span className="icon--vita icon--vita--warning self-center text-[95px] text-vita-purple" />
      </div>
    );
  }

  return null;
}
