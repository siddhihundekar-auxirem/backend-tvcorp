import app from "./app.js";
import sequelize from "./config/db.js";

// ✅ THIS LINE CREATES TABLES
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Tables Created");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch(err => console.log("❌ DB ERROR:", err));