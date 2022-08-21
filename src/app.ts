import dotenv from "dotenv";

import connection from "./db/config";
import { createClient } from "redis";
import connectRedis from "connect-redis";

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import passport from "./config/passport";

import routes from "./routes";

dotenv.config();

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

app.use((req: Request, res: Response, next: Function) => {
  // 요청이 들어오면 serialize 해서 req에 집어 넣는다.
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use(routes);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
