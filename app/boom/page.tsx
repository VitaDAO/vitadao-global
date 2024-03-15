export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  if (Math.random() > 0.5) throw new Error("Boom!");

  return (
    <div className="flex flex-grow items-center justify-center">
      <h1>All good</h1>
    </div>
  );
}
