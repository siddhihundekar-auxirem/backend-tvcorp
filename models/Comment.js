import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Video from "./Video.js";

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// 🔥 RELATIONS
User.hasMany(Comment, { foreignKey: "userId" });
Video.hasMany(Comment, { foreignKey: "videoId" });

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Video, { foreignKey: "videoId" });

export default Comment;