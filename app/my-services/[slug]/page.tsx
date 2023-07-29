import { getServiceBySlug } from "@/lib/services";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);
  return (
    <>
      <h1 className="text-h2 font-semibold">Service Page 🚧</h1>
      <p>{service.description}</p>
    </>
  );
}
