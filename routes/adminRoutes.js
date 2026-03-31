import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import User from "../models/User.js";
import Video from "../models/Video.js";

const router = express.Router();

// 🔥 ADMIN DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    res.json({ message: "Welcome Admin Dashboard 🚀" });
  }
);

// 🔥 GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    res.json(users);
  }
);

// 🔥 DELETE USER
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  }
);

// 🔥 GET ALL VIDEOS
router.get(
  "/videos",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const videos = await Video.findAll();
    res.json(videos);
  }
);

// 🔥 DELETE VIDEO
router.delete(
  "/videos/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    await Video.destroy({ where: { id: req.params.id } });
    res.json({ message: "Video deleted by admin" });
  }
);

export default router;