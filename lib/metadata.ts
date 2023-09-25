import type { Metadata } from "next";

// TODO adjust base URL for metas based on deploy target environment detection

interface BuildMetadataProps {
  title?: string;
}

export function buildMetadata({ title }: BuildMetadataProps = {}): Metadata {
  const baseUrl = "https://www.vitadao.global/";
  const finalTitle = title ? `${title} | VitaDAO.Global` : "VitaDAO.Global";
  const description =
    "The home for VitaDAO members, providing exclusive services, portfolio management and governance tools to VITA holders.";
  const imagePath = "vitadao-global-seo.png";

  return {
    metadataBase: new URL(baseUrl),
    title: finalTitle,
    description: description,
    openGraph: {
      url: baseUrl,
      type: "website",
      title: finalTitle,
      description: description,
      images: { url: imagePath, width: 1200, height: 630 },
    },
    twitter: {
      card: "summary_large_image",
      site: "@vita_dao",
      title: finalTitle,
      description: description,
      images: imagePath,
    },
  };
}
