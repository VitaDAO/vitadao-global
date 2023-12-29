import { type Metadata } from "next";

import { ErrorUi } from "@/components/ui/error-ui";
import { Pill } from "@/components/ui/pill";
import { buildMetadata } from "@/lib/metadata";
import { getArticle } from "@/lib/services/endpts";
import { truncateText } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { title } = await getArticle(params.slug);
    return buildMetadata({
      title: truncateText(title, 45) + " - Endpoints News",
      description: title,
    });
  } catch (e) {
    if (e instanceof Error) {
      return buildMetadata({ title: "Not found - Endpoints News" });
    } else {
      return buildMetadata({ title: "Unknown error - Endpoints News" });
    }
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const { title, body, imageSrc, trending, authors, channels, date } =
      await getArticle(params.slug);

    return (
      <div className="flex flex-wrap gap-x-[30px] gap-y-[20px]">
        <div className="shrink grow basis-[630px]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt=""
              className="mb-[12px] aspect-[730/412] w-full rounded-[20px] object-cover @xl/main:mb-[17px] @3xl/main:mb-[20px]"
            />
          )}
          {channels.length > 0 && (
            <div className="mb-[10px] flex flex-wrap gap-[10px] @xl/main:mb-[15px] @3xl/main:mb-[20px]">
              {channels.map((c) => (
                <a
                  key={c.pathname}
                  href={`/service/endpts?channel=${c.pathname}`}
                >
                  <Pill className="border border-[#CCCCCC] pb-[1px] pt-[3px] hover:bg-[#EEE]">
                    {c.name}
                  </Pill>
                </a>
              ))}
            </div>
          )}
          <h1 className="mb-[10px] text-lg/[26.4px] font-medium @xl/main:mb-[12px] @xl/main:text-h3 @3xl/main:mb-[17px] @3xl/main:text-h2 @3xl/main:tracking-[-0.24px]">
            {title}
          </h1>
          {date && (
            <p
              className="endpts-time mb-[14px] text-base/[140%] font-medium text-[#989898] @xl/main:mb-[18px] @3xl/main:mb-[24px]"
              dangerouslySetInnerHTML={{ __html: date }}
            ></p>
          )}
          <div className="mb-[14px] border-t border-[#ECECEC] @xl/main:mb-[18px] @3xl/main:mb-[24px]"></div>
          {body && (
            <div
              dangerouslySetInnerHTML={{ __html: body }}
              className="endpts prose max-w-none text-black"
            />
          )}
        </div>
        <div className="flex shrink grow basis-[280px] flex-col gap-y-[20px]">
          {authors.length > 0 && (
            <div className="flex flex-col gap-[16px] rounded-[20px] border p-[24px]">
              <h3 className="text-sm/[120%] uppercase tracking-[0.56px] text-[#606060]">
                {authors.length > 1 ? "Authors" : "Author"}
              </h3>
              {authors
                .flatMap((a) => [null, a])
                .slice(1)
                .map((a, cur) =>
                  a === null ? (
                    <div
                      key={`joiner-${cur}`}
                      className="border-t border-[#ECECEC]"
                    ></div>
                  ) : (
                    <div key={a.name} className="flex gap-[12px]">
                      <img
                        src={a.imageSrc}
                        alt={a.name}
                        className="h-[51px] w-[51px] rounded-full"
                      />
                      <div className="flex flex-col gap-[12px]">
                        <div>
                          <p className="text-[21px] font-medium">{a.name}</p>
                          <p className="text-base font-medium text-[#989898]">
                            {a.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-[15px] text-[#989898]">
                          {a.socials.email && (
                            <a href={a.socials.email}>
                              <span className="icon--vita icon--vita--email" />
                            </a>
                          )}
                          {a.socials.x && (
                            <a href={a.socials.x}>
                              <span className="icon--vita icon--vita--x" />
                            </a>
                          )}
                          {a.socials.linkedin && (
                            <a href={a.socials.linkedin}>
                              <span className="icon--vita icon--vita--linkedin" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
            </div>
          )}
          {trending.length > 0 && (
            <div className="flex flex-col gap-[16px] rounded-[20px] border p-[24px]">
              <h3 className="text-sm/[120%] uppercase tracking-[0.56px] text-[#606060] ">
                Trending now
              </h3>
              {trending
                .flatMap((f) => [null, f])
                .slice(1)
                .map((f, cur) =>
                  f === null ? (
                    <div
                      key={`joiner-${cur}`}
                      className="border-t border-[#ECECEC]"
                    ></div>
                  ) : (
                    <a
                      key={f.href}
                      href={f.href}
                      className="text-[21px] font-medium underline-offset-4 hover:underline"
                    >
                      {f.label}
                    </a>
                  ),
                )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      return <ErrorUi error={e} />;
    } else {
      return <ErrorUi error={new Error("Unknown error")} />;
    }
  }
}
