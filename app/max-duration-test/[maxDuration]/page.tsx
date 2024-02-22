import { z } from "zod";

export const maxDuration = 60;

export default async function Page({
  params,
}: {
  params: { maxDuration: string };
}) {
  const maxDuration = z.coerce.number().catch(0).parse(params.maxDuration);

  await new Promise((resolve) => setTimeout(() => resolve(true), maxDuration));

  return <p>{maxDuration}</p>;
}
