import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  addView,
  getCreatorStats,
  getHistory,
} from "../controllers/analyticsController.js";

const router = express.Router();

// 🔥 Add view (optional auth)
router.post("/view", authMiddleware, addView);

// 📊 Creator stats
router.get("/creator", authMiddleware, getCreatorStats);

// 👀 Watch history
router.get("/history", authMiddleware, getHistory);

export default router;