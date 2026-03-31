import { Sequelize } from "sequelize";

const sequelize = new Sequelize("tvcorp", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;