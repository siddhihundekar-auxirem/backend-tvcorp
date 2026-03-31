import Video from "../models/Video.js";
import History from "../models/History.js";
import Like from "../models/Like.js";
import Subscription from "../models/Subscription.js";

// 🎬 ADD VIEW + SAVE HISTORY
export const addView = async (req, res) => {
  try {
    const { videoId } = req.body;

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // 🔥 Increase views
    video.views += 1;
    await video.save();

    // 🔥 Save history (if logged in)
    if (req.user) {
      await History.create({
        userId: req.user.id,
        videoId,
      });
    }

    res.json({ message: "View counted", views: video.views });

  } catch (error) {
    console.log("VIEW ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 📊 GET CREATOR STATS
export const getCreatorStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVideos = await Video.count({ where: { userId } });

    const videos = await Video.findAll({ where: { userId } });

    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);

    const totalLikes = await Like.count({
      include: [
        {
          model: Video,
          where: { userId },
        },
      ],
    });

    const subscribers = await Subscription.count({
      where: { creatorId: userId },
    });

    res.json({
      totalVideos,
      totalViews,
      totalLikes,
      subscribers,
    });

  } catch (error) {
    console.log("STATS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 👀 USER WATCH HISTORY
export const getHistory = async (req, res) => {
  try {
    const history = await History.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Video,
          attributes: ["id", "title", "thumbnail"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(history);

  } catch (error) {
    console.log("HISTORY ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};