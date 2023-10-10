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
  description = "The home for VitaDAO members, providing exclusive services, portfolio management and governance tools to VITA holders.",
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
