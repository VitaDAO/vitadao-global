"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface ConcisePaginationProps {
  page: number;
  maxPage: number;
  className?: string;
}

export function ConcisePagination({
  page,
  maxPage,
  className,
}: ConcisePaginationProps) {
  const searchParams = useSearchParams();

  return (
    <div className={cn("flex gap-[10px] text-vita-purple", className)}>
      {page > 2 ? (
        <Link
          href={`?${updateSearchParams(searchParams, "page", String(1))}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          &lt;&lt;
        </Link>
      ) : (
        <span className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4 text-[#CCCCCC]">
          &lt;&lt;
        </span>
      )}
      {page > 1 ? (
        <Link
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(page - 1),
          )}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          &lt;
        </Link>
      ) : (
        <span className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4 text-[#CCCCCC]">
          &lt;
        </span>
      )}
      <span className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4 text-black">
        {page}
      </span>
      {page < maxPage ? (
        <Link
          href={`?${updateSearchParams(
            searchParams,
            "page",
            String(Number(page) + 1),
          )}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          &gt;
        </Link>
      ) : (
        <span className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4 text-[#CCCCCC]">
          &gt;
        </span>
      )}
      {page < maxPage - 1 ? (
        <Link
          href={`?${updateSearchParams(searchParams, "page", String(maxPage))}`}
          prefetch={false}
          className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4"
        >
          &gt;&gt;
        </Link>
      ) : (
        <span className="flex h-[42px] items-center rounded-full border border-[#CCCCCC] px-4 text-[#CCCCCC]">
          &gt;&gt;
        </span>
      )}
    </div>
  );
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
