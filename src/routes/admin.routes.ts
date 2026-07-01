import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getStats,
  getSearchLogs,
  getPlaces,
  updatePlace,
  deletePlace,
  getChats,
} from "../controllers/admin.controller";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.get("/search-logs", protect, adminOnly, getSearchLogs);
router.get("/places", protect, adminOnly, getPlaces);
router.put("/places/:id", protect, adminOnly, updatePlace);
router.delete("/places/:id", protect, adminOnly, deletePlace);
router.get("/chats", protect, adminOnly, getChats);

export default router;
