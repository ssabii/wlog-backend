import dotenv from "dotenv";

import sequelizeConnection from "./models";
import { createClient } from "redis";
import connectRedis from "connect-redis";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";

dotenv.config();

sequelizeConnection
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true });
redisClient.on("error", (err) => {
  console.log(err);
});
redisClient.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET || "some cookie",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    name: "session-cookie",
    store: new RedisStore({ client: redisClient }),
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome wlog");
});

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
