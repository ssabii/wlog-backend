import dotenv from "dotenv";

import { connectDB } from "./config/database";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import passportConfig from "./config/passport";

import routes from "./routes";
import { connectRedis } from "./config/redis";

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

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
