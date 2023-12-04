"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelSelectProps {
  options: {
    label: string;
    value: string;
  }[];
}

export function ChannelSelect({ options }: ChannelSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (options.length > 0) {
    const value = searchParams.get("channel") ?? "all";
    return (
      <Select
        value={value}
        onValueChange={(newValue) => router.push(`?channel=${newValue}`)}
      >
        <SelectTrigger className="h-[42px] w-[180px] rounded-full">
          <SelectValue placeholder="Channel" />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return null;
}
