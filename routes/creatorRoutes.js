import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔥 Only creator allowed
router.get("/dashboard", authMiddleware, roleMiddleware("creator"), (req, res) => {
  res.json({
    message: "Welcome Creator Dashboard 🚀",
  });
});

export default router;