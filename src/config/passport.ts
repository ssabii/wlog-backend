import fs from "fs";
import path from "path";

import { PassportStatic } from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import User from "../models/user";

const pathToPublicKey = path.join(__dirname, "..", "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf-8");

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new Strategy(options, (payload, done) => {
  User.findOne({ where: { username: payload.sub } })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

export default (passport: PassportStatic) => {
  passport.use(strategy);
};
