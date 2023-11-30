import { ErrorUi } from "@/components/ui/error-ui";
import { getArticle } from "@/lib/services/endpts";

export const revalidate = 300;

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const { title, body, imageSrc } = await getArticle(params.slug);

    return (
      <>
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            width={1140}
            height={480}
            alt=""
            className="mb-[10px] aspect-[1140/480] w-full rounded-[20px] object-cover @3xl/main:mb-[30px]"
          />
        )}
        <div className="max-w-[65ch]">
          <h1 className="mb-[30px] mt-[20px] text-lg/[26.4px] font-medium tracking-[-0.24px] @3xl/main:hidden">
            {title}
          </h1>
          <h1 className="mb-[30px] hidden text-h2 font-medium @3xl/main:block">
            {title}
          </h1>
        </div>
        {body && (
          <div
            // TODO please don't forget to somehow sanitize this
            dangerouslySetInnerHTML={{ __html: body }}
            className="endpts prose text-black"
          />
        )}
      </>
    );
  } catch (e) {
    if (e instanceof Error) {
      return <ErrorUi error={e} />;
    } else {
      return <ErrorUi error={new Error("Unknown error")} />;
    }
  }
}
