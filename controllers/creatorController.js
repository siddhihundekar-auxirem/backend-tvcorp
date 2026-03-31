import User from "../models/User.js";
import Video from "../models/Video.js";
import Subscription from "../models/Subscription.js"; // ✅ ADDED

// 👤 GET CREATOR PROFILE
export const getCreatorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const creator = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    res.json(creator);

  } catch (error) {
    console.log("CREATOR ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎬 GET CREATOR VIDEOS
export const getCreatorVideos = async (req, res) => {
  try {
    const { id } = req.params;

    const videos = await Video.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
    });

    res.json(videos);

  } catch (error) {
    console.log("CREATOR VIDEOS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 🔥 NEW: GET ALL CREATORS (MAIN API)
export const getAllCreators = async (req, res) => {
  try {
    // ✅ get only creators
    const creators = await User.findAll({
      where: { role: "creator" },
      attributes: ["id", "name", "email", "createdAt"],
    });

    // ✅ attach subscriber count + video count
    const creatorsWithStats = await Promise.all(
      creators.map(async (creator) => {

        const subscriberCount = await Subscription.count({
          where: { creatorId: creator.id },
        });

        const videoCount = await Video.count({
          where: { userId: creator.id },
        });

        return {
          ...creator.toJSON(),
          subscribers: subscriberCount,
          videos: videoCount,
        };
      })
    );

    res.json(creatorsWithStats);

  } catch (error) {
    console.log("GET ALL CREATORS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};