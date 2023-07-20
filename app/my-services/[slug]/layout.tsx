import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 @container">
      <p className="mb-4 mt-6 text-sm font-medium uppercase text-gray-800">
        <Link href="/my-services">&lt; My Services</Link>
      </p>
      <div className="space-y-5 rounded-xl bg-white p-5">{children}</div>
    </div>
  );
}
