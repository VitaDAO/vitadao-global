import { MediaElement } from "@/components/ui/media-element";
import { Pill } from "@/components/ui/pill";
import { buildMetadata } from "@/lib/metadata";
import { formatNumber } from "@/lib/utils";
import type { Asset, TreasuryGroup } from "./schemas";
import { treasuryGroupSchema } from "./schemas";

export const metadata = buildMetadata({
  title: "Treasury",
});

const typeOfChildren = (node: TreasuryGroup) => {
  return node.type === "group" &&
    Array.isArray(node.children) &&
    node.children.length > 0
    ? node.children[0].type
    : "unknown";
};

interface AssetRowProps {
  asset: Asset;
}

function initials(name: string, maxInitials: number = 3) {
  return name
    .split(/\s|\./)
    .slice(0, maxInitials)
    .map((term) => term[0])
    .join("")
    .toUpperCase();
}

function stringToHsl(s: string) {
  const hash = s
    .split("")
    .reduce((acc, cur) => cur.codePointAt(0) ?? 0 + ((acc << 5) - acc), 0);
  const h = hash % 360;
  return `hsl(${h} 70% 85%)`;
}

function AssetRow({ asset }: AssetRowProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-400 px-2 py-[15px]">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 flex-shrink-0 sm:h-9 sm:w-9">
          <MediaElement src={asset.mediaUrl}>
            <div
              className="flex h-full w-full flex-shrink-0 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: stringToHsl(asset.label) }}
            >
              {initials(asset.label, 3)}
            </div>
          </MediaElement>
        </div>
        <div>
          <p className="font-semibold leading-[120%]">{asset.label}</p>
          {asset.secondaryLabel && (
            <p className="text-sm leading-[120%]">{asset.secondaryLabel}</p>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col gap-[3px] text-right text-sm leading-[120%]">
        <p>${formatNumber(asset.value, { cutoff: 10 })}</p>
        {asset.type === "fungible-asset" ? (
          <p>{`${formatNumber(asset.balance)} ${asset.symbol}`}</p>
        ) : (
          asset.moleculesBalance && (
            <p>
              {`${formatNumber(asset.moleculesBalance)} ${
                asset.moleculesSymbol
              }`}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default async function Page() {
  const treasury = treasuryGroupSchema.parse(
    await fetch("https://api.bio.xyz/v1/treasury/vitadao", {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  );

  return (
    <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
      <div className="mb-[20px] flex flex-col justify-between gap-[30px] @xl/main:mb-[30px] @4xl:flex-row">
        <div>
          <h1 className="mb-[10px] text-h2 font-medium">VitaDAO Treasury</h1>
          <p className="max-w-[770px] text-base">
            The data presented on this page is obtained through manual updates
            or collected from third-party APIs, and is provided solely for
            informational purposes. While we strive to maintain the highest
            level of accuracy, some data may be incomplete or outdated. If you
            identify any errors, please notify us via our{" "}
            <a
              href="https://discord.com/invite/3S3ftnmZYD"
              target="_blank"
              className="underline underline-offset-4"
            >
              Discord
            </a>
            .
          </p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center rounded-xl bg-vita-purple p-[20px] text-white @xl/main:p-[30px]">
          <p className="whitespace-nowrap pt-2 text-h2 font-medium">
            <span className="text-h3">$</span> {formatNumber(treasury.value)}
          </p>
          <p className="text-[14px] leading-[120%]">Live DAO Treasury</p>
        </div>
      </div>
      {treasury.children.map((s) => (
        <div
          key={s.label + s.value}
          className="mb-[20px] space-y-[30px] rounded-xl bg-white p-[20px] last:mb-0 @xl/main:mb-[30px] @xl/main:p-[30px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold leading-[120%]">{`${
              s.label
            } · $${formatNumber(s.value)}`}</h2>
            {s.percent && (
              <Pill className="rounded-sm bg-vita-purple text-white">
                {`${formatNumber(s.percent)}%`}
              </Pill>
            )}
          </div>
          {s.type === "group" &&
            typeOfChildren(s) === "group" &&
            s.children.map(
              (t) =>
                t.value >= 100 && (
                  <div key={s.label + t.label}>
                    <h3 className="mb-3 font-medium leading-[120%] text-[#606060]">
                      {t.label}
                    </h3>
                    {t.type === "group" &&
                      t.children.map(
                        (a) =>
                          (a.type === "fungible-asset" ||
                            a.type === "generic-asset") && (
                            <AssetRow
                              key={s.label + t.label + a.label}
                              asset={a}
                            />
                          ),
                      )}
                  </div>
                ),
            )}
          {s.type === "group" &&
            typeOfChildren(s) !== "unknown" &&
            s.children.reduce(
              (acc, cur) =>
                ["fungible-asset", "generic-asset"].includes(cur.type)
                  ? (acc += 1)
                  : acc,
              0,
            ) > 0 && (
              <div>
                <h3 className="mb-3 font-medium leading-[120%] text-[#606060]">
                  Assets
                </h3>
                {s.children.map(
                  (a) =>
                    (a.type === "fungible-asset" ||
                      a.type === "generic-asset") && (
                      <AssetRow key={s.label + a.label} asset={a} />
                    ),
                )}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
