import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Video from "./Video.js";

const Like = sequelize.define("Like", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// 🔥 RELATIONS
User.hasMany(Like, { foreignKey: "userId" });
Video.hasMany(Like, { foreignKey: "videoId" });

Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Video, { foreignKey: "videoId" });

export default Like;