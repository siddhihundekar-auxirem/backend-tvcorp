import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  toggleSubscription,
  getMySubscriptions,
  getCreatorSubscribers,
  getCreatorSubscribersCount, // ✅ ADD THIS
} from "../controllers/subscriptionController.js";

const router = express.Router();

// 🔥 SUBSCRIBE / UNSUBSCRIBE
router.post("/toggle", authMiddleware, toggleSubscription);

// 🔥 MY SUBSCRIPTIONS
router.get("/my", authMiddleware, getMySubscriptions);

// 🔥 CREATOR SUBSCRIBERS (FULL LIST)
router.get("/creator/:creatorId", getCreatorSubscribers);

// 🔥 CREATOR SUBSCRIBER COUNT (IMPORTANT)
router.get("/creator/:creatorId/count", getCreatorSubscribersCount);

export default router;