import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createChannel,
  getMyChannel,
  getPendingChannels,
  approveChannel,
  rejectChannel,
} from "../controllers/channelController.js";
import { getAdminStats } from "../controllers/channelController.js";

const router = express.Router();

// ==============================
// 🔥 USER ROUTES
// ==============================

// ✅ CREATE CHANNEL
router.post("/create", authMiddleware, createChannel);

// ✅ REST VERSION (OPTIONAL - cleaner API)
router.post("/", authMiddleware, createChannel); // ✅ ADDED

// ✅ GET MY CHANNEL
router.get("/my", authMiddleware, getMyChannel);


// ==============================
// 🔥 ADMIN ROUTES
// ==============================

// ✅ GET ALL PENDING CHANNELS
router.get(
  "/admin/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingChannels
);

// ✅ APPROVE CHANNEL
router.put(
  "/admin/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveChannel
);

// ✅ REJECT CHANNEL
router.put(
  "/admin/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectChannel
);

router.get(
  "/admin/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminStats
);

// ==============================
// 🧪 OPTIONAL DEBUG ROUTE
// ==============================

// ✅ Check route working
router.get("/test", (req, res) => {
  res.json({ message: "Channel routes working ✅" });
});

export default router;
