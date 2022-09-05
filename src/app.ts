import dotenv from "dotenv";

import { connectDB } from "./config/database";
import { connectRedis } from "./config/redis";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";

import router from "./routes";

dotenv.config();

connectDB();

connectRedis();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1", router);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
