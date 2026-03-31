import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
uploadVideo,
getAllVideos,
getVideoById,
updateVideo,
deleteVideo,
searchVideos,
exploreVideos,
getVideosByCategory
} from "../controllers/videoController.js";

const router = express.Router();

// 🔍 SEARCH (must be before :id)
router.get("/search", searchVideos);

// 🌍 EXPLORE
router.get("/explore", exploreVideos);

// 🎯 CATEGORY
router.get("/category/:category", getVideosByCategory);

// 🎥 Public routes
router.get("/", getAllVideos);
router.get("/:id", getVideoById);

// 🔥 Upload (creator only)
router.post(
"/upload",
authMiddleware,
roleMiddleware("creator"),
uploadVideo
);

// ✏️ UPDATE
router.put("/:id", authMiddleware, roleMiddleware("creator"), updateVideo);

// 🗑 DELETE
router.delete("/:id", authMiddleware, roleMiddleware("creator"), deleteVideo);

export default router;
