import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import { toggleLike } from "../controllers/likeController.js";
import {
  addComment,
  editComment,
  deleteComment,
  getCommentsByVideo   // ✅ ADD THIS
} from "../controllers/commentController.js";

const router = express.Router();

// 👍 LIKE
router.post("/like", authMiddleware, toggleLike);

// 💬 COMMENT
router.post("/comment", authMiddleware, addComment);
router.put("/comment/:id", authMiddleware, editComment);
router.delete("/comment/:id", authMiddleware, deleteComment);
router.get("/comment/:videoId", getCommentsByVideo);

export default router;