import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

import User from "../models/User";

const privateKey = process.env.JWT_PRIVATE_KEY!;

export const issueJwt = (user: User) => {
  const username = user.username;
  const expiresIn = "7d";
  const payload: JwtPayload = {
    sub: username,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};
