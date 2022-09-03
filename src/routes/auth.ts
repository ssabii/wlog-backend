import express, { NextFunction, Request, Response } from "express";

import { refresh, sign } from "../lib/jwt";
import { generatePassword, validatePassword } from "../lib/password";
import User from "../models/User";
import authMiddleware, { JwtRequest } from "../middlewares/authMiddleware";
import { TypedRequestBody } from ".";
import { redisClient } from "../config/redis";

const router = express.Router();

router.get("/protected", authMiddleware, (req: JwtRequest, res, next) => {
  console.log(req.jwt);
  res.status(200).json({ message: "you are authorized" });
});

interface LoginRequestBody {
  username: string;
  password: string;
}

router.post(
  "/login",
  (
    req: TypedRequestBody<LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;

    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "password is required" });
      return;
    }

    User.findOne({ where: { username } })
      .then((user) => {
        if (!user) {
          res.status(401).json({ message: "could not found user" });
          return;
        }

        const { id, hash, salt } = user;
        const isValid = validatePassword(password, hash, salt);

        if (isValid) {
          const accessToken = sign(user);
          const refreshToken = refresh();

          redisClient.set(id, refreshToken);

          res.status(200).json({
            message: "success login",
            data: {
              token: {
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            },
          });
        } else {
          res.status(401).json({
            message: "invalid password",
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

interface RegisterRequestBody {
  username: string;
  password: string;
  displayName?: string;
}

router.post(
  "/register",
  async (req: TypedRequestBody<RegisterRequestBody>, res: Response) => {
    const { username, password, displayName } = req.body;
    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "password is required" });
      return;
    }

    const user = await User.findOne({ where: { username } });

    if (user) {
      res.status(409).json({ message: "username is already taken" });
      return;
    }

    const { salt, hash } = generatePassword(password);

    const newUser = User.build({
      username,
      salt,
      hash,
      displayName: displayName ?? username,
    });

    newUser.save().then(() => {
      res.json({ message: "success register" });
    });
  }
);

router.get("/", (req, res, next) => {
  console.log(req.sessionID, req.session);
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/api/v1/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout(() => {});
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("session-cookie");
    res.redirect("/protected-route");
  });
});

// for debugging
router.get("/debug", async (req: Request | any, res: Response) => {
  const user = await User.findOne({ where: { username: "ssabi" } });
  console.log(new Date(user?.createdAt).toLocaleString("ko-KR"));
});

export default router;
