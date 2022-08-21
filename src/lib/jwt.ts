import fs from "fs";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import path from "path";

import User from "../models/user";

const pathToPrivateKey = path.join(__dirname, "..", "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf-8");

export const issueJwt = (user: User) => {
  const username = user.username;
  const expiresIn = "7d";
  const payload: JwtPayload = {
    sub: username,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};
