import mongoose, { Schema, Document } from "mongoose";

export interface ISearchLog extends Document {
  userId?: string;
  query: string;
  location: { lat: number; lng: number; radius: number };
  resultsCount: number;
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    userId: String,
    query: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
      radius: Number,
    },
    resultsCount: Number,
  },
  { timestamps: true }
);

export default mongoose.model<ISearchLog>("SearchLog", SearchLogSchema);
