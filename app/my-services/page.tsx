import { ServiceCard } from "@/components/ui/service-card";
import { getServices, type Service } from "@/lib/services";
import { getUserBalance, getUserDid } from "@/lib/users";

export default async function Page() {
  const did = await getUserDid();
  const balance = await getUserBalance(did);
  // The read permissions are as follows:
  // - "public" services are readable by everyone.
  // - "private" services are readable by logged in users, irrespective of VITA
  //   balance.
  // - "holder" services are readable by logged in users with VITA balance greater
  //   than zero.
  // - "redeemer" services are readable only by those with enough VITA to actually
  //   redeem the service.
  const filter = [
    `read_access = "public"`,
    did && `read_access = "private"`,
    did && balance && balance > 0 && `read_access = "holder"`,
    did && balance && `read_access = "redeemer" && vita_required <= ${balance}`,
  ]
    .filter(Boolean)
    .join(" || ");
  // TODO fix any
  const services = (await getServices({ filter })) as any;

  return (
    <div className="mx-auto max-w-[1260px] @container">
      <div className="px-[20px] py-[30px] @xl:px-[30px] @xl:pt-[90px]">
        <h1 className="mb-[10px] text-h2 font-medium">My Services</h1>
        <p className="mb-[30px] max-w-[770px] text-base">
          Enjoy a suite of member services exclusive to VitaDAO members. VITA
          holders qualify for member services based on the amount of VITA in
          their connected wallet/s.
        </p>
        <div className="grid grid-cols-1 gap-[20px] @2xl:grid-cols-2 md:gap-[30px]">
          {services.map((s: Service) => (
            <ServiceCard
              key={s.id}
              service={s}
              className={s.is_featured ? "col-span-full" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
