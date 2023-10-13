import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/ui/client-layout";
import { buildMetadata } from "@/lib/metadata";
import { ConsentDialog } from "@/lib/tracking/consent-dialog";
import { GoogleAnalytics, Hotjar } from "@/lib/tracking/scripts";
import "./globals.css";

export const metadata = buildMetadata();

interface LayoutProps {
  children: React.ReactNode;
}

// TODO I don't think it matters, but these tracking scripts don't seem to end
// up as children of the head component and I'd like to know if this is just not
// possible in Next.js?
export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics env={process.env.VERCEL_ENV} />
        <Hotjar env={process.env.VERCEL_ENV} />
      </head>
      <body className="h-[100dvh] overflow-hidden bg-gray-200 font-tt-hoves">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        <ConsentDialog />
      </body>
    </html>
  );
}
