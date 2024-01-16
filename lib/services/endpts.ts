import "server-only";

import { parse } from "node-html-parser";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { CookieJar } from "tough-cookie";
import { z } from "zod";

import { gate } from "@/lib/auth";
import { NotFoundError } from "@/lib/errors";
import { getServiceBySlug } from "@/lib/services";

const BASE_URL = "https://endpts.com";

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

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "title"],
    "*": ["id", "style"],
  },
  allowedClasses: { "*": ["epn_*", "single_author"] },
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "html",
    "body",
    "head",
    "title",
    "img",
  ]),
  transformTags: {
    a: function (tagName, attribs) {
      let newAttribs = {};
      if (attribs.href.startsWith("https://endpts.com/channel/")) {
        newAttribs = {
          href: attribs.href.replace(
            "https://endpts.com/channel/",
            "/service/endpts/channel/",
          ),
        };
      } else if (
        attribs.href.startsWith("https://endpts.com/wp-content/") ||
        attribs.href.startsWith("https://endpts.com/author/")
      ) {
        // Do nothing
      } else if (attribs.href.startsWith("https://endpts.com/")) {
        // TODO maybe make this more specific by matching URLs with no
        // sub-levels? For example, we now transform the /author/author_name
        // routes even though we don't support them.
        newAttribs = {
          href: attribs.href.replace("https://endpts.com/", "/service/endpts/"),
        };
      }

      return {
        tagName,
        attribs: {
          ...attribs,
          ...newAttribs,
        },
      };
    },
  },
};

interface SearchEndptsItemsProps {
  page?: number;
  search: string;
}

export async function searchEndptsItems({
  page,
  search,
}: SearchEndptsItemsProps) {
  const endptsService = await getServiceBySlug("endpoints-news");
  if (endptsService === null) throw new NotFoundError();

  await gate(endptsService.vita_required);

  const slug = `/page/${page ?? 1}/?s=${search}`;
  const res = await fetch("https://endpts.com" + slug);
  const html = await res.text();
  const dom = parse(sanitizeHtml(html, sanitizeOptions));

  const items = dom
    .querySelectorAll("div.epn_result_list > div.epn_item")
    .map((item) => {
      const titleElement = item.querySelector("h3 > a");
      const timeElement = item.querySelector("div.epn_time");
      const channelElements = item.querySelectorAll("div.epn_channel > a");
      return {
        imageSrc: undefined,
        title: titleElement?.getAttribute("title"),
        pathname: titleElement
          ?.getAttribute("href")
          ?.replace("https://endpts.com", "endpts/"),
        age: timeElement?.textContent,
        channels: channelElements.map((channel) => {
          const match = channel
            .getAttribute("href")
            ?.match(/channel\/([\w-]+)\//);
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
    { label: "News Briefing", value: "news-briefing" },
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

interface GetEndptsItemsProps {
  page?: number;
  channel?: string;
}

export async function getEndptsItems({
  page,
  channel,
}: GetEndptsItemsProps = {}) {
  const endptsService = await getServiceBySlug("endpoints-news");
  if (endptsService === null) throw new NotFoundError();

  await gate(endptsService.vita_required);

  const slug =
    (channel === "all" || channel === undefined
      ? "/news"
      : "/channel/" + channel) + `/page/${page ?? 1}/`;
  const res = await fetch("https://endpts.com" + slug);
  const html = await res.text();
  const dom = parse(sanitizeHtml(html, sanitizeOptions));

  const items = dom.querySelectorAll("div.epn_item").map((item) => {
    const imageElement = item.querySelector("div.epn_image");
    const imageMatch = imageElement
      ?.getAttribute("style")
      ?.match(/background-image:url\('(?<imageSrc>\S+)'\)/);
    const titleElement = item.querySelector("h3 > a");
    const timeElement = item.querySelector("div.epn_time");
    const channelElements = item.querySelectorAll("div.epn_channel > a");
    return {
      imageSrc: imageMatch?.groups?.imageSrc,
      title: titleElement?.getAttribute("title"),
      pathname: titleElement
        ?.getAttribute("href")
        ?.replace("https://endpts.com", "endpts/"),
      age: timeElement?.textContent,
      channels: channelElements.map((channel) => {
        const match = channel
          .getAttribute("href")
          ?.match(/channel\/([\w-]+)\//);
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
    { label: "News Briefing", value: "news-briefing" },
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

export const getArticle = cache(async (path: string) => {
  const endptsService = await getServiceBySlug("endpoints-news");
  if (endptsService === null) throw new NotFoundError();

  await gate(endptsService.vita_required);

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
  const dom = parse(sanitizeHtml(html, sanitizeOptions));

  const titleElement = dom.querySelector("article h1");

  const contentElement = dom.querySelector("article div.epn_content");

  if (titleElement === null || contentElement === null) {
    throw new NotFoundError();
  }

  // Remove crap
  contentElement
    ?.querySelectorAll(".epn_ad_wrapper")
    .forEach((el) => contentElement.removeChild(el));
  const limitElement = contentElement?.querySelector("div.epn_limit");
  if (contentElement && limitElement) {
    contentElement.removeChild(limitElement);
  }
  const tagBoxElement = contentElement?.querySelector("div.epn_tag_box");
  if (contentElement && tagBoxElement) {
    contentElement.removeChild(tagBoxElement);
  }

  const imageElement = dom.querySelector("article > div.epn_image > img");

  const trending = dom
    .querySelectorAll(
      "div.epn_stream_box > div.epn_item:not(.epn_item--sponsored) a",
    )
    .map((a) => ({
      label: a.getAttribute("title"),
      href: a.getAttribute("href"),
    }));

  const authors = dom.querySelectorAll("div.single_author").map((author) => {
    const imageSrc = author
      .querySelector("div.epn_image")
      ?.getAttribute("style")
      ?.match(/background-image:url\('(?<imageSrc>\S+)'\)/)?.groups?.imageSrc;
    const name = author.querySelector("h3")?.textContent;
    const title = author.querySelector("h4")?.textContent;
    const email = author
      .querySelector("div.epn_social a.epn_mail")
      ?.getAttribute("href");
    const x = author
      .querySelector("div.epn_social a.epn_twitter")
      ?.getAttribute("href");
    const linkedin = author
      .querySelector("div.epn_social a.epn_linkedin")
      ?.getAttribute("href");

    return {
      imageSrc,
      name,
      title,
      socials: {
        email,
        x,
        linkedin,
      },
    };
  });

  // Remove author box (we already scraped what we wanted into the authors const)
  const authorBoxElement = contentElement?.querySelector("div.epn_author_box");
  if (contentElement && authorBoxElement) {
    contentElement.removeChild(authorBoxElement);
  }

  const channels = dom
    .querySelectorAll("article div.epn_channel a")
    .map((channel) => ({
      name: channel.textContent,
      pathname: channel
        .getAttribute("href")
        ?.match(/channel\/(?<pathname>[\w-]+)\//)?.groups?.pathname,
    }));

  const date = dom.querySelector("article div.epn_time")?.innerHTML;

  // Clean up (rare) full-width in-article images
  // e.g. brii-bio-backs-infectious-disease-startup-while-inking-deal-for-its-lead-tb-drug-doubling-down-on-antibiotics
  contentElement
    ?.querySelectorAll("div.epn_image:not(.epn_image_aside)")
    .forEach((contentImageElement) => {
      const image = contentImageElement.querySelector("img");
      contentImageElement
        .querySelectorAll("p")
        .forEach((paragraph) => contentImageElement.removeChild(paragraph));
      if (image) {
        contentImageElement.appendChild(image);
      }
    });

  return {
    title: titleElement?.textContent,
    body: contentElement?.innerHTML,
    imageSrc: imageElement?.getAttribute("src"),
    trending,
    authors,
    channels,
    date,
  };
});

function isNotNull<T>(v: T | null): v is T {
  return v !== null;
}
