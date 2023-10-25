import type { Metadata } from "next";

// TODO adjust base URL for metas based on deploy target environment detection

interface BuildMetadataProps {
  baseUrl?: string;
  title?: string;
  description?: string;
  imagePath?: string;
}

export function buildMetadata({
  baseUrl = "https://www.vitadao.global/",
  title: inputTitle,
  description = "Take advantage of exclusive member benefits, link multiple wallets for an overview of your VITA holdings, and explore active and past governance proposals - all in one place.",
  imagePath = "vitadao-global-seo.png",
}: BuildMetadataProps = {}): Metadata {
  const title = inputTitle
    ? `${inputTitle} | VitaDAO.Global`
    : "VitaDAO.Global";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      url: baseUrl,
      type: "website",
      title,
      description,
      images: { url: imagePath, width: 1200, height: 630 },
    },
    twitter: {
      card: "summary_large_image",
      site: "@vita_dao",
      title,
      description,
      images: imagePath,
    },
  };
}
