import Channel from "../models/Channel.js";
import User from "../models/User.js";

// 🔥 CREATE CHANNEL (USER)
export const createChannel = async (req, res) => {
  try {
    const { name, description, avatar, banner } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Channel name required" });
    }

    // ❌ Check if user already has channel
    const existing = await Channel.findOne({
      where: { userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already created a channel",
      });
    }

    const channel = await Channel.create({
      name,
      description,
      avatar,
      banner,
      userId: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      message: "Channel created, waiting for admin approval",
      channel,
    });

  } catch (error) {
    console.log("CREATE CHANNEL ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔥 GET MY CHANNEL
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      where: { userId: req.user.id },
    });

    res.json(channel);

  } catch (error) {
    console.log("GET MY CHANNEL ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔥 ADMIN: GET PENDING CHANNELS
export const getPendingChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll({
      where: { status: "pending" },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(channels);

  } catch (error) {
    console.log("PENDING CHANNEL ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔥 ADMIN: APPROVE CHANNEL ⭐
export const approveChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findByPk(id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // ❌ PREVENT DOUBLE APPROVAL
    if (channel.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }

    // ❌ PREVENT APPROVE AFTER REJECT
    if (channel.status === "rejected") {
      return res.status(400).json({ message: "Channel already rejected" });
    }

    // ✅ update channel
    channel.status = "approved";
    await channel.save();

    // ✅ update user role
    const user = await User.findByPk(channel.userId);

    if (user && user.role !== "creator") {
      user.role = "creator";
      await user.save();
    }

    res.json({
      message: "Channel approved & user promoted to creator",
      channel,
    });

  } catch (error) {
    console.log("APPROVE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔥 ADMIN: REJECT CHANNEL
export const rejectChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findByPk(id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // ❌ PREVENT DOUBLE REJECT
    if (channel.status === "rejected") {
      return res.status(400).json({ message: "Already rejected" });
    }

    // ❌ PREVENT REJECT AFTER APPROVAL
    if (channel.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }

    channel.status = "rejected";
    await channel.save();

    res.json({
      message: "Channel rejected",
      channel,
    });

  } catch (error) {
    console.log("REJECT ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 ADMIN STATS
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCreators = await User.count({
      where: { role: "creator" },
    });
    const pendingChannels = await Channel.count({
      where: { status: "pending" },
    });

    res.json({
      totalUsers,
      totalCreators,
      pendingChannels,
    });

  } catch (error) {
    console.log("STATS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};
