import Comment from "../models/Comment.js";

// 📥 GET COMMENTS BY VIDEO
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.findAll({
      where: { videoId },
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);

  } catch (error) {
    console.log("GET COMMENTS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 💬 ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    const comment = await Comment.create({
      text,
      videoId,
      userId: req.user.id,
    });

    res.json({ message: "Comment added", comment });

  } catch (error) {
    console.log("COMMENT ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✏️ EDIT COMMENT
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = text;
    await comment.save();

    res.json({ message: "Comment updated", comment });

  } catch (error) {
    console.log("EDIT ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🗑 DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.destroy();

    res.json({ message: "Comment deleted" });

  } catch (error) {
    console.log("DELETE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};