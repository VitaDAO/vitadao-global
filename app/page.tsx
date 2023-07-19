import { Marquee } from "@/components/ui/marquee";

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
    </>
  );
}
