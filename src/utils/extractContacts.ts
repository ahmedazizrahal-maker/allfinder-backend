import * as cheerio from "cheerio";

export const extractContacts = (html: string) => {
  const $ = cheerio.load(html);

  const email = $("a[href^='mailto:']").attr("href")?.replace("mailto:", "");
  const phone = $("a[href^='tel:']").attr("href")?.replace("tel:", "");
  const whatsapp = $("a[href*='wa.me']").attr("href");
  const addressUrl = $("a[href*='://google.com']").attr("href");

  return { email, phone, whatsapp, addressUrl };
};
