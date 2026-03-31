import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import sequelize from "../config/db.js"; // ✅ for count queries

// 🔥 SUBSCRIBE / UNSUBSCRIBE (OPTIMIZED)
export const toggleSubscription = async (req, res) => {
  try {
    const { creatorId } = req.body;

    // ✅ VALIDATION
    if (!creatorId) {
      return res.status(400).json({ message: "creatorId required" });
    }

    // ❌ Prevent self subscribe
    if (req.user.id === creatorId) {
      return res.status(400).json({ message: "Cannot subscribe to yourself" });
    }

    // 🔍 CHECK EXISTING
    const existing = await Subscription.findOne({
      where: {
        subscriberId: req.user.id,
        creatorId,
      },
    });

    let isSubscribed;

    if (existing) {
      // ❌ UNSUBSCRIBE
      await existing.destroy();
      isSubscribed = false;
    } else {
      // ✅ SUBSCRIBE
      await Subscription.create({
        subscriberId: req.user.id,
        creatorId,
      });
      isSubscribed = true;
    }

    // 🔥 GET UPDATED COUNT
    const subscribersCount = await Subscription.count({
      where: { creatorId },
    });

    return res.json({
      message: isSubscribed ? "Subscribed ✅" : "Unsubscribed ❌",
      isSubscribed,
      subscribersCount, // ⭐ IMPORTANT for frontend
    });

  } catch (error) {
    console.log("SUBSCRIBE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 GET MY SUBSCRIPTIONS (OPTIMIZED RESPONSE)
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { subscriberId: req.user.id },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // ✅ CLEAN RESPONSE
    const formatted = subscriptions.map((sub) => ({
      id: sub.id,
      creator: sub.creator,
      createdAt: sub.createdAt,
    }));

    res.json(formatted);

  } catch (error) {
    console.log("GET SUB ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 GET CREATOR SUBSCRIBERS + COUNT
export const getCreatorSubscribers = async (req, res) => {
  try {
    const { creatorId } = req.params;

    // 🔥 FETCH SUBSCRIBERS
    const subscribers = await Subscription.findAll({
      where: { creatorId },
      include: [
        {
          model: User,
          as: "subscriber",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 🔥 COUNT (FAST)
    const totalSubscribers = subscribers.length;

    res.json({
      totalSubscribers,
      subscribers,
    });

  } catch (error) {
    console.log("GET CREATOR SUB ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCreatorSubscribersCount = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const totalSubscribers = await Subscription.count({
      where: { creatorId },
    });

    res.json({ totalSubscribers });

  } catch (error) {
    console.log("COUNT ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCreators = async (req, res) => {
  try {
    const creators = await User.findAll({
      where: { role: "creator" },
      attributes: ["id", "name", "email"],

      include: [
        {
          model: Subscription,
          as: "creatorSubscriptions",
          attributes: [],
        },
      ],

      group: ["User.id"],

      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("creatorSubscriptions.id")),
            "subscriberCount",
          ],
        ],
      },
    });

    res.json(creators);

  } catch (error) {
    console.log("GET ALL CREATORS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};