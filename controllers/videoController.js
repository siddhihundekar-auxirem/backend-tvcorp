import Video from "../models/Video.js";
import { Op } from "sequelize";

// 🎬 UPLOAD VIDEO
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category } = req.body;

    // ✅ VALIDATION
    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Title & Video URL required" });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail,
      category,
      userId: req.user.id, // 🔥 from token
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });

  } catch (error) {
    console.log("UPLOAD ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🎥 GET ALL VIDEOS
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(videos);

  } catch (error) {
    console.log("GET VIDEOS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🎥 GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);

  } catch (error) {
    console.log("GET VIDEO ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ UPDATE VIDEO
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // 🔥 Only owner can edit
    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    video.title = title || video.title;
    video.description = description || video.description;

    await video.save();

    res.json({ message: "Video updated", video });

  } catch (error) {
    console.log("UPDATE VIDEO ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🗑 DELETE VIDEO (CREATOR)
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await video.destroy();

    res.json({ message: "Video deleted" });

  } catch (error) {
    console.log("DELETE VIDEO ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔍 SEARCH VIDEOS
export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;

    const videos = await Video.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.json(videos);

  } catch (error) {
    console.log("SEARCH ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🌍 EXPLORE VIDEOS
export const exploreVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(videos);

  } catch (error) {
    console.log("EXPLORE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎯 FILTER BY CATEGORY
export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const videos = await Video.findAll({
      where: { category },
    });

    res.json(videos);

  } catch (error) {
    console.log("CATEGORY ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};