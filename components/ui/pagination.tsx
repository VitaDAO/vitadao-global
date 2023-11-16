"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  maxPage: number;
  className?: string;
}

export function Pagination({ page, maxPage, className }: PaginationProps) {
  const searchParams = useSearchParams();

  return (
    <div className={cn("flex gap-[10px] text-vita-purple", className)}>
      {page > 1 && (
        <Link
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(page - 1),
          )}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          Prev
        </Link>
      )}
      {getPaginationList(page, maxPage).map((cur, idx) =>
        cur === "..." ? (
          <span
            key={`oh-god-i-hate-keys-${idx}`}
            className="flex h-[42px] items-center justify-center text-[#CCCCCC]"
          >
            ...
          </span>
        ) : (
          <Link
            key={cur}
            href={`?${updateSearchParams(
              searchParams,
              "page",
              String(Number(cur)),
            )}`}
            prefetch={false}
            className={cn(
              "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#CCCCCC] px-4 py-2",
              page === cur && "border-vita-purple",
            )}
          >
            {cur}
          </Link>
        ),
      )}
      {page < maxPage && (
        <Link
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(Number(page) + 1),
          )}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          Next
        </Link>
      )}
    </div>
  );
}

function getPaginationList(page: number, maxPage: number) {
  const middleRange = [page - 1, page, page + 1].filter(
    (p) => p > 1 && p < maxPage,
  );

  const pages = Array.from(
    new Set([1, 2, ...middleRange, maxPage - 1, maxPage]),
  );

  const paginationList = pages.reduce<(number | "...")[]>((acc, cur) => {
    const last = acc.slice(-1)[0];
    if (last === undefined || last === "..." || last === cur - 1) {
      return [...acc, cur];
    } else {
      return [...acc, "...", cur];
    }
  }, []);

  return paginationList;
}

function updateSearchParams(
  searchParams: URLSearchParams,
  name: string,
  value: string,
) {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set(name, value);
  return newSearchParams;
}
