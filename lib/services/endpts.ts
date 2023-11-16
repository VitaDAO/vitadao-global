import { parse } from "node-html-parser";

interface GetEndptsItemsProps {
  page?: number;
  channel?: string;
}

export async function getEndptsItems({
  page,
  channel,
}: GetEndptsItemsProps = {}) {
  const slug =
    (channel === "all" || channel === undefined
      ? "/news"
      : "/channel/" + channel) + `/page/${page ?? 1}/`;
  const res = await fetch("https://endpts.com" + slug);
  const html = await res.text();
  const dom = parse(html);

  const items = dom.querySelectorAll("div.epn_item").map((item) => {
    const titleElement = item.querySelector("h3 > a");
    const timeElement = item.querySelector("div.epn_time");
    const channelElements = item.querySelectorAll("div.epn_channel > a");
    return {
      title: titleElement?.getAttribute("title"),
      pathname: titleElement
        ?.getAttribute("href")
        ?.replace("https://endpts.com", "/endpts"),
      age: timeElement?.textContent,
      channels: channelElements.map((channel) => ({
        name: channel.textContent,
        pathname: channel
          .getAttribute("href")
          ?.replace("https://endpts.com", "/endpts"),
      })),
    };
  });

  const pages = dom
    .querySelectorAll("div.epn_ux_pagination > .epn_navigation")
    .map((el) => {
      const href = el.getAttribute("href");

      if (typeof href === "string") {
        const matches = href.match(/\/(\d+)\//);
        return matches ? Number(matches[matches.length - 1]) : null;
      } else {
        return Number(el.textContent);
      }
    })
    .filter(isNotNull);

  const channels = [
    { label: "All News", value: "all" },
    ...dom
      .querySelectorAll("div.epn_menu a")
      .map((el) => {
        const matches = el.getAttribute("href")?.match(/channel\/([\w-]+)\//);

        if (matches) {
          const value = matches[matches.length - 1];
          const label = el.textContent;
          return { value, label };
        }

        return null;
      })
      .filter(isNotNull),
  ];

  return {
    channels,
    items,
    maxPage: pages[pages.length - 1],
  };
}

export async function getArticle(slug: string) {
  const res = await fetch("https://endpts.com/" + slug);
  const html = await res.text();
  const dom = parse(html);

  const titleElement = dom.querySelector("article h1");

  const contentElement = dom.querySelector("article div.epn_content");
  const limitElement = contentElement?.querySelector("div.epn_limit");
  if (contentElement && limitElement) {
    contentElement.removeChild(limitElement);
  }

  const imageElement = dom.querySelector("article > div.epn_image > img");

  return {
    title: titleElement?.textContent,
    body: contentElement?.innerHTML,
    imageSrc: imageElement?.getAttribute("src"),
  };
}

function isNotNull<T>(v: T | null): v is T {
  return v !== null;
}
