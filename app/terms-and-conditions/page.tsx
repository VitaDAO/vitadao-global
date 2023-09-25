import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms and conditions",
});

export default function Page() {
  return (
    <div className="px-[20px] py-[30px] @xl/main:px-[30px] @xl/main:pt-[90px]">
      <h1 className="mb-[10px] text-h2 font-medium">Terms and conditions</h1>
      <p className="mb-[30px] max-w-[770px] text-base">
        Fugiat pariatur pariatur velit mollit ad sint sunt esse reprehenderit
        nostrud do do. Ipsum in adipisicing cillum excepteur velit in eu
        pariatur. Esse consectetur nulla consectetur qui in laborum cupidatat
        est incididunt dolore elit occaecat consequat. Id excepteur eiusmod
        nulla ut consequat qui est adipisicing eu officia. Incididunt cupidatat
        labore sunt deserunt Lorem sunt reprehenderit dolor eiusmod qui esse
        fugiat. Do sit mollit voluptate occaecat cillum.
      </p>
    </div>
  );
}
