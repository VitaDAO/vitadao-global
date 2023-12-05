import { VitadaoSpinner } from "@/components/ui/vitadao-spinner";

export default function Loading() {
  return (
    <div className="flex flex-grow items-center justify-center py-[30px]">
      <VitadaoSpinner />
    </div>
  );
}
