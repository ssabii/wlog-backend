import express, { NextFunction, Request, Response } from "express";

import { issueJwt } from "../lib/jwt";
import { generatePassword, validatePassword } from "../lib/password";
import User from "../models/User";
import authMiddleware, { JwtRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/protected", authMiddleware, (req: JwtRequest, res, next) => {
  console.log(req.jwt);
  res.status(200).json({ success: true, message: "you are authorized" });
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "could not find user" });
      }
      const isValid = validatePassword(
        req.body.username,
        user!.hash,
        user!.salt
      );

      if (isValid) {
        const { token, expires } = issueJwt(user!);
        res.status(200).json({ success: true, user: user, token, expires });
      } else {
        res
          .status(401)
          .json({ success: false, message: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  const { salt, hash } = generatePassword(req.body.password);

  const newUser = User.build({
    username: req.body.username,
    salt,
    hash,
    displayName: req.body.username,
  });

  newUser.save().then((user) => {
    const { token, expires } = issueJwt(user);
    res.json({ success: true, user: user, token, expires });
  });
});

router.get("/", (req, res, next) => {
  console.log(req.sessionID, req.session);
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
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
