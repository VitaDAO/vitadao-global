import { cn } from "@/lib/utils";

interface ConcisePaginationProps extends React.ComponentPropsWithoutRef<"div"> {
  page: number;
  maxPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function ConciseServerPagination({
  page,
  maxPage,
  searchParams,
  className,
  ...rest
}: ConcisePaginationProps) {
  return (
    <div
      className={cn("flex gap-[10px] text-vita-purple", className)}
      {...rest}
    >
      {page > 2 ? (
        <a
          href={`?${updateSearchParams(searchParams, "page", String(1))}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-vita-purple"
        >
          <span className="icon--vita icon--vita--pagination-last rotate-180" />
        </a>
      ) : (
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
          <span className="icon--vita icon--vita--pagination-last rotate-180" />
        </span>
      )}
      {page > 1 ? (
        <a
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(page - 1),
          )}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-vita-purple"
        >
          <span className="icon--vita icon--vita--pagination-next rotate-180" />
        </a>
      ) : (
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
          <span className="icon--vita icon--vita--pagination-next rotate-180" />
        </span>
      )}
      <span className="flex h-[42px] items-center overflow-hidden rounded-full border border-[#CCCCCC] text-black">
        <form method="GET">
          <input
            type="text"
            name="page"
            className="ml-[1px] inline-block h-[38px] w-[5ch] rounded-l-full text-center outline-offset-[-1px]"
            defaultValue={page}
          />
          {Object.entries(searchParams).map(
            ([name, value]) =>
              name !== "page" && (
                <input
                  key={`hidden-input-${name}`}
                  type="hidden"
                  name={name}
                  value={value}
                />
              ),
          )}
        </form>{" "}
        <span className="pl-3 pr-5">of {maxPage}</span>
      </span>
      {page < maxPage ? (
        <a
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(Number(page) + 1),
          )}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-vita-purple"
        >
          <span className="icon--vita icon--vita--pagination-next" />
        </a>
      ) : (
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
          <span className="icon--vita icon--vita--pagination-next" />
        </span>
      )}
      {page < maxPage - 1 ? (
        <a
          href={`?${updateSearchParams(searchParams, "page", String(maxPage))}`}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-vita-purple"
        >
          <span className="icon--vita icon--vita--pagination-last" />
        </a>
      ) : (
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
          <span className="icon--vita icon--vita--pagination-last" />
        </span>
      )}
    </div>
  );
}

function updateSearchParams(
  searchParams: { [key: string]: string | string[] | undefined },
  name: string,
  value: string,
) {
  // @ts-ignore damn you Next.js
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set(name, String(value));
  return newSearchParams;
}
