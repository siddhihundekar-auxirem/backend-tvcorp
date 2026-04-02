import app from "./app.js";
import sequelize from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Use dynamic port (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

// Connect DB + Start Server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ DB Connected");

    return sequelize.sync({ alter: true }); // creates/updates tables
  })
  .then(() => {
    console.log("✅ Tables Synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB ERROR:", err);
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