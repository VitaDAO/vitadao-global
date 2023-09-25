import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/ui/client-layout";
import "./globals.css";

// TODO adjust base URL for metas based on deploy target environment detection
const baseUrl = "https://www.vitadao.com/";
const title = "VitaDAO.Global";
const description =
  "The home for VitaDAO members, providing exclusive services, portfolio management and governance tools to VITA holders.";
const imagePath = "vitadao-global-seo.png";

export const metadata: Metadata = {
  title: {
    template: "%s | VitaDAO.Global",
    default: title,
  },
  description: description,
  openGraph: {
    url: baseUrl,
    type: "website",
    title: title,
    description: description,
    images: { url: baseUrl + imagePath, width: 1200, height: 630 },
  },
  twitter: {
    card: "summary_large_image",
    site: "@vita_dao",
    title: title,
    description: description,
    images: baseUrl + imagePath,
  },
};

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
