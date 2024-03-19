export const dynamic = "force-dynamic";

export default async function Page() {
  await new Promise((resolve) =>
    setTimeout(() => resolve("wait's over!"), 3000),
  );

  if (Math.random() > 0.5) throw new Error("Boom!");

  return (
    <div className="flex flex-grow items-center justify-center">
      <h1>All good</h1>
    </div>
  );
}
