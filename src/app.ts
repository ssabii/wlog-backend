import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(`<h1>Your Work Log</h1>`);
});

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
