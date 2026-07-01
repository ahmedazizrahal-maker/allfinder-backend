import { Request, Response } from "express";
import SearchLog from "../models/SearchLog";
import Place from "../models/Place";
import Chat from "../models/Chat";
import User from "../models/User";

export const getStats = async (req: Request, res: Response) => {
  const users = await User.countDocuments();
  const places = await Place.countDocuments();
  const chats = await Chat.countDocuments();
  const searches = await SearchLog.countDocuments();

  res.json({ users, places, chats, searches });
};

export const getSearchLogs = async (req: Request, res: Response) => {
  const logs = await SearchLog.find().sort({ createdAt: -1 }).limit(100);
  res.json(logs);
};

export const getPlaces = async (req: Request, res: Response) => {
  const places = await Place.find().sort({ createdAt: -1 });
  res.json(places);
};

export const updatePlace = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Place.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

export const deletePlace = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  res.json({ message: "Place deleted" });
};

export const getChats = async (req: Request, res: Response) => {
  const chats = await Chat.find().sort({ updatedAt: -1 }).limit(50);
  res.json(chats);
};
