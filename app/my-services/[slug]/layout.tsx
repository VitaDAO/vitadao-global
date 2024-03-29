import { headers } from "next/headers";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  let referer = headers().get("referer") ?? "/my-services";
  if (!/\/my-services[^\/]/.test(referer)) {
    referer = "/my-services";
  }

  return (
    <div className="flex flex-grow flex-col px-0 pt-[30px] sm:px-[30px] sm:pb-[30px] sm:pt-[90px]">
      <p className="mx-[20px] mb-[30px] text-base/none font-medium sm:mx-0">
        <Link href={referer} className="underline underline-offset-4">
          <span className="icon--vita icon--vita--chevron mr-3 -rotate-90 text-[9px]" />
          Back to Member Services
        </Link>
      </p>
      <div className="flex flex-grow flex-col rounded-[20px] bg-white p-[20px] pb-[30px] @xl/main:p-[30px]">
        {children}
      </div>
    </div>
  );
}
