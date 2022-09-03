import dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

const connection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  models: [path.join(__dirname, "..", "models")],
});

export const connectDB = () => {
  connection
    .sync({ force: false, logging: false })
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
