import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  preferredLanguage?: string;
  theme?: "light" | "dark";
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferredLanguage: { type: String, default: "en" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
