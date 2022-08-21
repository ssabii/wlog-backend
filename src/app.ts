import dotenv from "dotenv";

import connectRedis from "connect-redis";
import { createClient } from "redis";
import connection from "./db/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import passportConfig from "./config/passport";

import routes from "./routes";

dotenv.config();

passportConfig(passport);

connection
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
    saveUninitialized: false,
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

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
