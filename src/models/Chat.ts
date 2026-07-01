import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  placeId: string;
  userId?: string;
  guestId?: string;
  messages: {
    from: "user" | "place" | "system";
    text: string;
    timestamp: Date;
  }[];
  status: "open" | "closed";
}

const ChatSchema = new Schema<IChat>(
  {
    placeId: { type: String, required: true },
    userId: String,
    guestId: String,
    messages: [
      {
        from: { type: String, enum: ["user", "place", "system"] },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
