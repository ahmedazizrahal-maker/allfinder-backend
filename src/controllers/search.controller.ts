import { Request, Response } from "express";
import axios from "axios";
import Place from "../models/Place";
import { extractNavbar } from "../utils/extractNavbar";
import { extractContacts } from "../utils/extractContacts";
import { geocodeAddress } from "../utils/geocode";

export const searchPlaces = async (req: Request, res: Response) => {
  const { q, lat, lng, radius } = req.query;

  if (!q) return res.status(400).json({ message: "Query is required" });

  try {
    const googleRes = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: process.env.GOOGLE_SEARCH_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q,
          gl: "ch",
          cr: "countryCH",
          lr: "lang_de|lang_fr|lang_it|lang_en",
          num: 10,
        },
      }
    );

    const items = googleRes.data.items || [];
    const results: any[] = [];

    for (const item of items) {
      const websiteUrl = item.link;

      // Fetch website HTML
      let html = "";
      try {
        const siteRes = await axios.get(websiteUrl, { timeout: 5000 });
        html = siteRes.data;
      } catch {
        continue;
      }

      // Extract navbar + contacts
      const navbarLinks = extractNavbar(html, websiteUrl);
      const contact = extractContacts(html);

      // Geocode
      const address =
        contact.addressUrl || item.formattedUrl || item.displayLink || null;

      const coords = await geocodeAddress(address);

      if (!coords) continue;

      // Save or update place
      const place = await Place.findOneAndUpdate(
        { websiteUrl },
        {
          name: item.title,
          websiteUrl,
          navbarLinks,
          contact,
          location: coords,
          source: "google_search",
        },
        { upsert: true, new: true }
      );

      results.push(place);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};
