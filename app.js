import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import creatorPublicRoutes from "./routes/creatorPublicRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/creators", creatorPublicRoutes);
app.use("/api/channels", channelRoutes);

app.get("/", (req, res) => {
  res.send("🚀 TVCORP Backend Running");
});

export default app;