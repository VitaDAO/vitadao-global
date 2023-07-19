import Image from "next/image";
import NextLink from "next/link";

export default function Page() {
  return (
    <div className="space-y-5 p-4 md:p-0">
      <h1 className="text-h2 font-semibold">My Services</h1>
      <p className="text-xs sm:text-base">
        Esse dolore eiusmod laboris labore non veniam elit consectetur aliquip
        qui. Cupidatat ipsum anim consequat duis in consectetur aliquip sint
        nostrud deserunt ut. Duis excepteur ea ullamco cupidatat duis sunt quis
        tempor commodo enim ullamco sit labore incididunt occaecat. Ad
        reprehenderit in quis veniam tempor laboris do laborum consectetur id.
      </p>
      <div className="grid grid-cols-1 gap-5 overflow-clip rounded-xl bg-white @2xl:grid-cols-2">
        <div className="flex flex-col gap-5 p-5">
          <p className="text-h2">Wonderful Stays Logo</p>
          <h2 className="text-h4">
            Dolor laborum occaecat sint et duis adipisicing ex aute.
          </h2>
          <p className="flex-grow">
            Proident laboris cillum cillum incididunt voluptate exercitation
            eiusmod laborum occaecat labore. Elit ut sit sint culpa. Minim
            proident adipisicing dolore in mollit non proident ea officia.
          </p>
          <p>
            <NextLink
              href="/my-services/wonderful-stays"
              className="text-vita-purple underline"
            >
              View this service
            </NextLink>
          </p>
        </div>
        <Image
          src="/my-services/landscape.jpg"
          height={640}
          width={427}
          alt=""
          className="row-start-1 h-full max-h-60 w-full object-cover @2xl:col-start-2 @2xl:max-h-none"
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 @2xl:grid-cols-2">
        <div className="flex flex-col gap-5 rounded-xl bg-white p-5">
          <p className="text-h2">Truthy News Logo</p>
          <p className="flex-grow">
            Lorem velit qui aliqua enim. Laboris amet pariatur enim laborum
            dolore esse. Esse proident sunt commodo id.
          </p>
          <p>
            <NextLink
              href="/my-services/truthy-news"
              className="text-vita-purple underline"
            >
              View this service
            </NextLink>
          </p>
        </div>
        <div className="flex flex-col gap-5 rounded-xl bg-white p-5">
          <p className="text-h2">The Earth Logo</p>
          <p>
            In et proident aute deserunt dolore. Reprehenderit labore esse
            cupidatat occaecat et deserunt nisi consequat pariatur cillum sint
            pariatur consequat deserunt ut.
          </p>
          <p className="flex-grow">
            <NextLink
              href="/my-services/the-earth"
              className="text-vita-purple underline"
            >
              View this service
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
