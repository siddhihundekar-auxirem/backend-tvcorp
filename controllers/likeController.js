import Like from "../models/Like.js";

// 🔥 TOGGLE LIKE
export const toggleLike = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: "videoId required" });
    }

    const existing = await Like.findOne({
      where: {
        userId: req.user.id,
        videoId,
      },
    });

    if (existing) {
      await existing.destroy();
    } else {
      await Like.create({
        userId: req.user.id,
        videoId,
      });
    }

    // 🔥 COUNT
    const totalLikes = await Like.count({
      where: { videoId },
    });

    res.json({
      message: existing ? "Unliked" : "Liked",
      totalLikes,
    });

  } catch (error) {
    console.log("LIKE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};