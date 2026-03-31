import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Subscription = sequelize.define("Subscription", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // 🔥 REQUIRED FIELDS
  subscriberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  timestamps: true,

  // 🔥 PREVENT DUPLICATES
  indexes: [
    {
      unique: true,
      fields: ["subscriberId", "creatorId"],
    },
  ],
});


// =============================
// 🔥 RELATIONS (SAFE + OPTIMIZED)
// =============================

// 👤 USER → SUBSCRIPTIONS (user subscribed to others)
User.hasMany(Subscription, {
  foreignKey: "subscriberId",
  as: "subscriptions",
});

// 👤 USER → SUBSCRIBERS (people who follow creator)
User.hasMany(Subscription, {
  foreignKey: "creatorId",
  as: "subscribers",
});

// 🔥 ADD THIS (VERY IMPORTANT FOR COUNT API)
User.hasMany(Subscription, {
  foreignKey: "creatorId",
  as: "creatorSubscriptions", // ✅ USED IN COUNT QUERY
});

// 🔗 RELATIONS BACK
Subscription.belongsTo(User, {
  foreignKey: "subscriberId",
  as: "subscriber",
});

Subscription.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

export default Subscription;