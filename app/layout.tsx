import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/ui/client-layout";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = buildMetadata();

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="h-[100dvh] overflow-hidden bg-gray-200 font-tt-hoves">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
