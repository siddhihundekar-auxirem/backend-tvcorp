import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Channel = sequelize.define(
  "Channel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,

      // ✅ ADDED VALIDATION
      validate: {
        len: [3, 100],
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ✅ IMPORTANT: EXPLICIT FOREIGN KEY FIELD
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,

    // ✅ PERFORMANCE IMPROVEMENT
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

// 🔥 RELATIONS
User.hasMany(Channel, {
  foreignKey: "userId",
  as: "channels",
});

Channel.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

export default Channel;
