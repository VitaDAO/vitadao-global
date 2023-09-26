import Image from "next/image";
import Link from "next/link";

import vitaPlanet from "@/public/vita-planet.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-[20px] pt-[90px]">
      <Image
        src={vitaPlanet}
        alt=""
        height={287}
        width={668}
        className="mb-[20px]"
      />
      <h2 className="text-h4 font-medium">Not Found</h2>
      <p className="mb-[20px]">Could not find the requested page.</p>
      <Link
        href="/"
        className="font-semibold text-vita-purple underline underline-offset-4"
      >
        Return Home
        <span className="icon--vita icon--vita--chevron ml-2 rotate-90 text-[9px]" />
      </Link>
    </div>
  );
}
