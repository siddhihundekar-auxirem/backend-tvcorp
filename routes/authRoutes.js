import express from "express";
import { login, register, getMe } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ ADD THIS

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// ✅ Protected route
router.get("/me", authMiddleware, getMe);

export default router;
