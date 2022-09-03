import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import { redisClient } from "../config/redis";

import User from "../models/User";

const privateKey = process.env.JWT_PRIVATE_KEY as string;
const publicKey = process.env.JWT_PUBLIC_KEY as string;

export const sign = (user: User) => {
  const expiresIn = "1h";
  const payload: JwtPayload = {
    sub: user.id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });

  return "Bearer" + signedToken;
};

export const verify = (token: string) => {
  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
};

export const refresh = () => {
  const expiresIn = "7d";
  const signedToken = jwt.sign({}, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });

  return "Bearer" + signedToken;
};

export const verifyRefresh = async (token: string, id: string) => {
  const getAsync = promisify(redisClient.get).bind(redisClient);

  try {
    const user = await getAsync(id);

    if (token === user) {
      jwt.verify(token, publicKey);
    }

    return true;
  } catch (e) {
    return false;
  }
};
