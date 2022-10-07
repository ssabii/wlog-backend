import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import { redisClient } from "../config/redis";
import ms from "ms";

import User from "models/User";

const privateKey = process.env.JWT_PRIVATE_KEY as string;
const publicKey = process.env.JWT_PUBLIC_KEY as string;

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
  displayName: string;
}

export const sign = (user: User) => {
  const expiresIn = ms("1h");
  const payload: CustomJwtPayload = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });

  return signedToken;
};

export const verify = (token: string) => {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      clockTimestamp: Date.now() / 1000,
    });
  } catch (err) {
    throw err;
  }
};

export const refresh = () => {
  const expiresIn = ms("7d");
  const signedToken = jwt.sign({}, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });

  return signedToken;
};

export const verifyRefresh = async (token: string, id: string) => {
  const getAsync = promisify(redisClient.get).bind(redisClient);

  try {
    const data = await getAsync(id);

    if (token !== data) {
      return false;
    }

    try {
      jwt.verify(token, publicKey, { clockTimestamp: Date.now() / 1000 });
      return true;
    } catch (err) {
      return false;
    }
  } catch (err) {
    return false;
  }
};
