import mongoose, { Schema, Document } from "mongoose";

export interface IPlace extends Document {
  name: string;
  location: { lat: number; lng: number };
  address?: string;
  websiteUrl?: string;
  navbarLinks?: { label: string; url: string }[];
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  categories?: string[];
  source: "google_search" | "google_places" | "manual";
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
    },
    address: String,
    websiteUrl: String,
    navbarLinks: [
      {
        label: String,
        url: String,
      },
    ],
    contact: {
      email: String,
      phone: String,
      whatsapp: String,
    },
    categories: [String],
    source: {
      type: String,
      enum: ["google_search", "google_places", "manual"],
      default: "google_search",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlace>("Place", PlaceSchema);
