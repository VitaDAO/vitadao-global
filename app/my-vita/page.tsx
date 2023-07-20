import { VitaStatsCard } from "@/components/server/vita-stats";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
      <h1 className="text-h2 font-semibold">My VITA</h1>
      <p className="text-xs max-w-[667px] sm:text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
        vehicula libero odio, at lobortis nunc aliquet cursus. Phasellus
        volutpat purus consectetur euismod rhoncus.
      </p>
      <div className="grid">
        <div className="bg-white p-5">Balances or connect blurb</div>
        <div className="bg-white p-5">Buy moar</div>
      </div>
      <VitaStatsCard />
    </div>
  );
}
