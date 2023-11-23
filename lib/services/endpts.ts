import "server-only";

import { parse } from "node-html-parser";
import { CookieJar } from "tough-cookie";
import { z } from "zod";

import { gate } from "@/lib/auth";

const BASE_URL = "https://endpts.com";
// TODO fetch VITA required from Pocketbase assuming a given slug
const MIN_VITA = 100;

const cookieJar = new CookieJar();

async function authenticateEndpts() {
  const endptsEmail = z
    .string({ required_error: "Missing Endpoints News email env var." })
    .parse(process.env.ENDPTS_EMAIL);
  const endptsPassword = z
    .string({ required_error: "Missing Endpoints News password env var." })
    .parse(process.env.ENDPTS_PASSWORD);

  const formData = new FormData();
  formData.append("action", "log_in");
  formData.append("email", endptsEmail);
  formData.append("password", endptsPassword);

  const path = "/wp-admin/admin-ajax.php";
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    body: formData,
  });
  res.headers
    .getSetCookie()
    .map((header) => cookieJar.setCookieSync(header, BASE_URL));
}

interface GetEndptsItemsProps {
  page?: number;
  channel?: string;
}

export async function getEndptsItems({
  page,
  channel,
}: GetEndptsItemsProps = {}) {
  await gate(MIN_VITA);

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
        ?.replace("https://endpts.com", "endpts/"),
      age: timeElement?.textContent,
      channels: channelElements.map((channel) => {
        const match = channel
          .getAttribute("href")
          ?.match(/channel\/([\w-]+)\//);
        console.log(
          `${channel.getAttribute("href")} ### ${match?.[0]} ### ${match?.[1]}`,
        );
        return {
          name: channel.textContent,
          pathname: match?.[1],
        };
      }),
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

export async function getArticle(path: string) {
  await gate(MIN_VITA);

  let cookieString = cookieJar.getCookieStringSync(BASE_URL);
  if (!cookieString) {
    await authenticateEndpts();
    cookieString = cookieJar.getCookieStringSync(BASE_URL);
  }

  const res = await fetch(BASE_URL + "/" + path, {
    headers: {
      Cookie: cookieString,
    },
  });
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
