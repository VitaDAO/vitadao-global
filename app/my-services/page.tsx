import Image from "next/image";
import Link from "next/link";

import { getServices } from "@/lib/services";
import { cn } from "@/lib/utils";

export default async function Page() {
  // TODO figure out authz/filtering by user. Either we set up cookie auth with
  // Privy and we RSC with the authn user (or whatever is public if no user
  // logged in) or we set up an API route and solve with local storage auth.
  const services = await getServices();

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
      <h1 className="text-h2 font-semibold">My Services</h1>
      <p>
        Esse dolore eiusmod laboris labore non veniam elit consectetur aliquip
        qui. Cupidatat ipsum anim consequat duis in consectetur aliquip sint
        nostrud deserunt ut. Duis excepteur ea ullamco cupidatat duis sunt quis
        tempor commodo enim ullamco sit labore incididunt occaecat. Ad
        reprehenderit in quis veniam tempor laboris do laborum consectetur id.
      </p>
      <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.id}
            className={cn(
              "grid grid-cols-1 overflow-hidden rounded-xl bg-white",
              s.image_path &&
                "@2xl:col-start-1 @2xl:col-end-[-1] @2xl:grid-cols-2"
            )}
          >
            {s.image_path && (
              <div className="max-h-[250px] @2xl:order-2 @2xl:max-h-none">
                <Image
                  src={s.image_path}
                  alt=""
                  width={600}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-5 p-[30px]">
              {s.is_featured && (
                <p className="text-sm uppercase tracking-[0.56px] text-[#606060]">
                  Featured service
                </p>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.logo_path}
                alt=""
                className="max-h-[25px] object-contain object-left"
              />
              {s.title && <p className="text-h4">{s.title}</p>}
              <p>{s.description}</p>
              <p className="flex flex-grow flex-col justify-end">
                <Link
                  href={`/my-services/${s.slug}`}
                  className="text-vita-purple underline"
                >
                  View this service
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
