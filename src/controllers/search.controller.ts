import { Request, Response } from "express";
import axios from "axios";
import Place from "../models/Place";
import { extractNavbar } from "../utils/extractNavbar";
import { extractContacts } from "../utils/extractContacts";
import { geocodeAddress } from "../utils/geocode";

export const searchPlaces = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ message: "Query is required" });

  try {
    // 🔥 Serper.dev search request
    const serperRes = await axios.post(
      "https://google.serper.dev/search",
      {
        q,
        gl: "ch", // Switzerland
        hl: "de", // German (you can change dynamically later)
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const items = serperRes.data.organic || [];
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
      const address = contact.addressUrl || item.snippet || item.title || null;

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
          source: "serper",
        },
        { upsert: true, new: true }
      );

      results.push(place);
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed", error });
  }
};
