import Image from "next/image";
import NextLink from "next/link";

export default function Home() {
  return (
    <>
      <div className="rounded-xl bg-black bg-[url('/fresh-3d-bg.jpg')] bg-[center_right_-100px] bg-no-repeat px-5 py-10 text-white">
        <div className="relative max-w-sm space-y-5">
          <h1 className="text-h3 font-semibold">Welcome to VitaDAO.Global</h1>
          <p>
            The new home for VitaDAO members, providing exclusive services,
            portfolio management and governance tools to VITA holders.
          </p>
          <p className="text-sm">
            <span className="rounded-md bg-vita-purple px-2 py-1">
              Under construction. Stay tuned for updates!
            </span>
          </p>
        </div>
      </div>
      <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
        Exclusive to our members
      </p>
      <div className="grid grid-cols-2 gap-5 overflow-clip rounded-xl bg-white">
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
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-5">
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
    </>
  );
}
