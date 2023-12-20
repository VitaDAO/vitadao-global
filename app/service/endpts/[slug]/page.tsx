import { ErrorUi } from "@/components/ui/error-ui";
import { getArticle } from "@/lib/services/endpts";

export const revalidate = 300;

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const { title, body, imageSrc, trending, authors } = await getArticle(
      params.slug,
    );

    return (
      <div className="flex flex-wrap gap-x-[30px] gap-y-[20px]">
        <div className="shrink grow basis-[630px]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt=""
              className="mb-[10px] aspect-[730/412] w-full rounded-[20px] object-cover @3xl/main:mb-[30px]"
            />
          )}
          <h1 className="text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl/main:text-h2">
            {title}
          </h1>
          {body && (
            <div
              dangerouslySetInnerHTML={{ __html: body }}
              className="endpts prose text-black"
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
