import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Video from "./Video.js";

const History = sequelize.define("History", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  watchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// 🔥 RELATIONS
User.hasMany(History, { foreignKey: "userId" });
Video.hasMany(History, { foreignKey: "videoId" });

History.belongsTo(User, { foreignKey: "userId" });
History.belongsTo(Video, { foreignKey: "videoId" });

export default History;