import express from "express";
import { searchPlaces } from "../controllers/search.controller";

const router = express.Router();

router.get("/", searchPlaces);

export default router;
