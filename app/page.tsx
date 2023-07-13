import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import NextLink from "next/link";

export default function Page() {
  return (
    <>
      <div className="bg-black bg-[center_right_-200px] px-5 py-5 pb-16 text-white @4xl:bg-[center_right_-50px] md:rounded-xl md:bg-[url('/fresh-3d-bg.jpg')] md:bg-[length:auto_100%] md:bg-no-repeat md:py-10 md:pb-10">
        <div className="relative space-y-5 text-center md:max-w-sm md:text-left">
          <div className="h-52 rounded-xl [background:linear-gradient(0deg,rgba(98,86,236,0.26)_0%,rgba(98,86,236,0.26)_100%),url(/fresh-3d-bg.jpg)center/cover_no-repeat,lightgray_50%/cover_no-repeat] md:hidden" />
          <h1 className="text-h3 font-semibold">Welcome to VitaDAO.Global</h1>
          <p>
            The new home for VitaDAO members, providing exclusive services,
            portfolio management and governance tools to VITA holders.
          </p>
          <p className="hidden text-sm md:block">
            <span className="rounded-md bg-vita-purple px-2 py-1">
              Under construction. Stay tuned for updates!
            </span>
          </p>
        </div>
      </div>
      <Marquee
        label=" UNDER CONSTRUCTION – STAY TUNED FOR UPDATES! –"
        className="bg-vita-purple py-1 text-sm text-white md:hidden"
      />
      <div className="p-4 md:p-0">
        <p className="mb-4 mt-6 text-center text-sm font-medium uppercase text-gray-800 md:text-left">
          Exclusive to our members
        </p>
        <div className="grid grid-cols-1 gap-5 overflow-clip rounded-xl bg-white @2xl:grid-cols-2">
          <div className="flex flex-col gap-5 p-5">
            <p className="text-h2">Company Logo</p>
            <h2 className="text-h4">
              Dolor laborum occaecat sint et duis adipisicing ex aute.
            </h2>
            <p className="flex-grow">
              Proident laboris cillum cillum incididunt voluptate exercitation
              eiusmod laborum occaecat labore. Elit ut sit sint culpa. Minim
              proident adipisicing dolore in mollit non proident ea officia.
            </p>
            <p>
              <NextLink href="#" className="text-vita-purple underline">
                View this service
              </NextLink>
            </p>
          </div>
          <Image
            src="/services/landscape.jpg"
            height={640}
            width={427}
            alt=""
            className="row-start-1 h-full max-h-60 w-full object-cover @2xl:col-start-2 @2xl:max-h-none"
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 @2xl:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-xl bg-white p-5">
            <p className="text-h2">Company Logo</p>
            <p className="flex-grow">
              Lorem velit qui aliqua enim. Laboris amet pariatur enim laborum
              dolore esse. Esse proident sunt commodo id.
            </p>
            <p>
              <NextLink href="#" className="text-vita-purple underline">
                View this service
              </NextLink>
            </p>
          </div>
          <div className="flex flex-col gap-5 rounded-xl bg-white p-5">
            <p className="text-h2">Company Logo</p>
            <p>
              In et proident aute deserunt dolore. Reprehenderit labore esse
              cupidatat occaecat et deserunt nisi consequat pariatur cillum sint
              pariatur consequat deserunt ut.
            </p>
            <p className="flex-grow">
              <NextLink href="#" className="text-vita-purple underline">
                View this service
              </NextLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
