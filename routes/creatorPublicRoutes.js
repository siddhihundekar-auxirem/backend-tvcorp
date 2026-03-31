import express from "express";
import {
  getCreatorProfile,
  getCreatorVideos,
  getAllCreators,
} from "../controllers/creatorController.js";

const router = express.Router();

// 🔥 GET ALL CREATORS
router.get("/", getAllCreators);

// 👤 GET CREATOR PROFILE
router.get("/:id", getCreatorProfile);

// 🎬 GET CREATOR VIDEOS
router.get("/:id/videos", getCreatorVideos);

export default router;