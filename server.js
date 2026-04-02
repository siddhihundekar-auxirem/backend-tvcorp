import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});



// import app from "./app.js";
// import sequelize from "./config/db.js";

// // ✅ THIS LINE CREATES TABLES
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("✅ Tables Created");

//     app.listen(5000, () => {
//       console.log("🚀 Server running on port 5000");
//     });
//   })
//   .catch(err => console.log("❌ DB ERROR:", err));