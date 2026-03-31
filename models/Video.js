import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Video = sequelize.define("Video", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  videoUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  thumbnail: {
    type: DataTypes.TEXT,
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  category: {
    type: DataTypes.STRING,
  },
});

// 🔥 RELATION
User.hasMany(Video, { foreignKey: "userId" });
Video.belongsTo(User, { foreignKey: "userId" });

export default Video;