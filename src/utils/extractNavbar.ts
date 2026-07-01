import * as cheerio from "cheerio";

export const extractNavbar = (html: string, baseUrl: string) => {
  const $ = cheerio.load(html);
  const links: any[] = [];

  $("nav a, header a, .navbar a, .menu a").each((_, el) => {
    const label = $(el).text().trim();
    let url = $(el).attr("href");

    if (!label || !url) return;

    if (url.startsWith("/")) {
      url = baseUrl + url;
    }

    links.push({ label, url });
  });

  return links.slice(0, 10);
};
