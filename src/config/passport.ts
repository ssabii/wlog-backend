import passport from "passport";
import {
  Strategy as LocalStrategy,
  IStrategyOptions,
  VerifyFunction,
} from "passport-local";

import { validatePassword } from "../lib/password";
import User from "../models/user";

const options: IStrategyOptions = {
  usernameField: "username",
  passwordField: "password",
};

const verifyCallback: VerifyFunction = (username, password, done) => {
  User.findOne({ where: { username } }).then((user) => {
    if (!user) {
      return done(null, false);
    }

    const isValid = validatePassword(password, user.hash, user.salt);

    if (isValid) return done(null, user);
    else return done(null, false);
  });
};

const strategy = new LocalStrategy(options, verifyCallback);

passport.use(strategy);

passport.serializeUser((user: any, done) => {
  done(null, user.username);
});

passport.deserializeUser((username: string, done) => {
  User.findOne({ where: { username } })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

export default passport;
