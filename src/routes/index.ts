import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

import User from "../models/user";
import { generatePassword } from "../lib/password";
import { isAdmin, isAuth } from "./authMiddleware";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
    failureFlash: true,
  })
);

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  const { salt, hash } = generatePassword(req.body.password);

  const newUser = User.build({
    username: req.body.username,
    salt,
    hash,
    admin: true,
  });
  newUser.save().then((user) => console.log(user));

  res.redirect("/login");
});

router.get("/", (req, res, next) => {
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

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
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
router.get("/debug", (req: Request | any, res: Response) => {
  res.json({
    "req.session": req.session,
    "req.user": req.user,
  });
});

export default router;
