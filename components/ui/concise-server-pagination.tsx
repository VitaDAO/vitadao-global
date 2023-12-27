import { cn, generateHref, updateSearchParams } from "@/lib/utils";

interface ConcisePaginationProps extends React.ComponentPropsWithoutRef<"div"> {
  page: number;
  maxPage: number;
  searchParams: URLSearchParams;
  baseHref: string;
}

export function ConciseServerPagination({
  page,
  maxPage,
  searchParams,
  baseHref,
  className,
  ...rest
}: ConcisePaginationProps) {
  return (
    <div
      className={cn("flex gap-[10px] text-vita-purple", className)}
      {...rest}
    >
      <First page={page} searchParams={searchParams} baseHref={baseHref} />
      <Previous page={page} searchParams={searchParams} baseHref={baseHref} />
      <span className="flex h-[42px] items-center overflow-hidden rounded-full border border-[#CCCCCC] text-black">
        <form method="GET">
          {Array.from(searchParams.entries()).map(
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
          <input
            type="text"
            name="page"
            className="ml-[1px] inline-block h-[38px] w-[5ch] rounded-l-full text-center outline-offset-[-1px]"
            defaultValue={page}
          />
        </form>{" "}
        <span className="pl-3 pr-5">of {maxPage}</span>
      </span>
      <Next
        page={page}
        maxPage={maxPage}
        searchParams={searchParams}
        baseHref={baseHref}
      />
      <Last
        page={page}
        maxPage={maxPage}
        searchParams={searchParams}
        baseHref={baseHref}
      />
    </div>
  );
}

function PaginationControl({
  href,
  children,
}: React.ComponentPropsWithoutRef<"div"> & { href: string }) {
  if (href) {
    return (
      <a
        href={href}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-vita-purple"
      >
        {children}
      </a>
    );
  }

  return (
    <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] text-[#CCCCCC]">
      {children}
    </span>
  );
}

function First({
  page,
  searchParams,
  baseHref,
}: {
  page: number;
  searchParams: URLSearchParams;
  baseHref: string;
}) {
  const href = generateHref(
    baseHref,
    updateSearchParams(searchParams, "page", null),
  );

  return (
    <PaginationControl href={page > 1 ? href : ""}>
      <span className="icon--vita icon--vita--pagination-last rotate-180" />
    </PaginationControl>
  );
}

function Previous({
  page,
  searchParams,
  baseHref,
}: {
  page: number;
  searchParams: URLSearchParams;
  baseHref: string;
}) {
  const href = generateHref(
    baseHref,
    updateSearchParams(searchParams, "page", page > 2 ? page - 1 : null),
  );

  return (
    <PaginationControl href={page > 1 ? href : ""}>
      <span className="icon--vita icon--vita--pagination-next rotate-180" />
    </PaginationControl>
  );
}

function Next({
  page,
  maxPage,
  searchParams,
  baseHref,
}: {
  page: number;
  maxPage: number;
  searchParams: URLSearchParams;
  baseHref: string;
}) {
  const href = generateHref(
    baseHref,
    updateSearchParams(searchParams, "page", page + 1),
  );

  return (
    <PaginationControl href={page < maxPage ? href : ""}>
      <span className="icon--vita icon--vita--pagination-next" />
    </PaginationControl>
  );
}

function Last({
  page,
  maxPage,
  searchParams,
  baseHref,
}: {
  page: number;
  maxPage: number;
  searchParams: URLSearchParams;
  baseHref: string;
}) {
  const href = generateHref(
    baseHref,
    updateSearchParams(searchParams, "page", maxPage),
  );

  return (
    <PaginationControl href={page < maxPage ? href : ""}>
      <span className="icon--vita icon--vita--pagination-last" />
    </PaginationControl>
  );
}
