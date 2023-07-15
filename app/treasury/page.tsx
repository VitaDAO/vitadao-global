import { MediaElement } from "@/components/ui/media-element";
import { formatNumber } from "@/lib/utils";
import type { Asset, TreasuryGroup } from "./schemas";
import { treasuryGroupSchema } from "./schemas";

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
    <div className="flex items-start justify-between border-t border-gray-400">
      <div className="flex items-start gap-3 px-2 py-3">
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
          <div className="font-bold">{asset.label}</div>
          {asset.secondaryLabel && <span>{asset.secondaryLabel}</span>}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col px-2 py-3 text-right">
        <span>${formatNumber(asset.value, 0)}</span>
        {asset.type === "fungible-asset" ? (
          <span>{`${formatNumber(asset.balance)} ${asset.symbol}`}</span>
        ) : (
          asset.moleculesBalance && (
            <span>
              {`${formatNumber(asset.moleculesBalance)} ${
                asset.moleculesSymbol
              }`}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default async function Page() {
  const treasury = treasuryGroupSchema.parse(
    await fetch("https://api.bio.xyz/v1/treasury/vitadao").then((res) =>
      res.json()
    )
  );

  return (
    <div className="space-y-5 p-4 md:p-0">
      <h1 className="text-h2 font-semibold">{`Treasury · $${formatNumber(
        treasury.value
      )}`}</h1>
      <p className="text-xs sm:text-base">
        The data presented on this page is obtained through manual updates or
        collected from third-party APIs, and is provided solely for
        informational purposes. While we strive to maintain the highest level of
        accuracy, some data may be incomplete or outdated. If you identify any
        errors, please notify us via our{" "}
        <a
          href="https://discord.com/invite/3S3ftnmZYD"
          className="text-vita-purple underline"
        >
          Discord
        </a>
        .
      </p>
      {treasury.children.map((s) => (
        <div
          key={s.label + s.value}
          className="space-y-5 rounded-xl bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg">{`${s.label} · $${formatNumber(
              s.value
            )}`}</h2>
            {s.percent && (
              <span className="rounded-lg bg-gray-400 px-2 py-1 text-sm uppercase leading-none">
                {`${formatNumber(s.percent)}%`}
              </span>
            )}
          </div>
          <div>
            {s.type === "group" &&
              typeOfChildren(s) === "group" &&
              s.children.map((t) => (
                <>
                  <h3 key={s.label + t.label} className="mb-3 font-semibold">
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
                        )
                    )}
                </>
              ))}
            {s.type === "group" &&
              typeOfChildren(s) !== "unknown" &&
              s.children.map(
                (a) =>
                  (a.type === "fungible-asset" ||
                    a.type === "generic-asset") && (
                    <AssetRow key={s.label + a.label} asset={a} />
                  )
              )}
          </div>
        </div>
      ))}
      <p className="text-right text-sm opacity-30 hover:opacity-100">
        Powered by the amazing{" "}
        <a href="https://www.bio.xyz/" className="text-vita-purple underline">
          Bio.xyz
        </a>{" "}
        API &trade;
      </p>
    </div>
  );
}
