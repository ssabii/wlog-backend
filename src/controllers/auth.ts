import { NextFunction, Request, Response } from "express";
import { promisify } from "util";

import { redisClient } from "config/redis";
import { decode } from "jsonwebtoken";
import {
  CustomJwtPayload,
  refresh,
  sign,
  verify,
  verifyRefresh,
} from "lib/jwt";
import { generatePassword, validatePassword } from "lib/password";
import User from "models/User";
import { Empty, JwtRequest } from ".";

interface LoginDetail {
  username: string;
  password: string;
}

export const postLogin = (
  req: Request<Empty, Empty, LoginDetail>,
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
        redisClient.expire(id, 60 * 60 * 24);

        res.status(200).json({
          message: "success login",
          data: {
            accessToken,
            refreshToken,
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
};

interface RegisterDetail extends LoginDetail {
  display_name?: string;
}

export const postRegister = async (
  req: Request<RegisterDetail>,
  res: Response
) => {
  const { username, password, display_name } = req.body;
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
    displayName: display_name ?? username,
  });

  newUser.save().then(() => {
    res.json({ message: "success register" });
  });
};

export const getLogin = (req: Request, res: Response) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/api/v1/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
};

export const getRegister = (req: Request, res: Response) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
};

export const getLogout = async (req: JwtRequest, res: Response) => {
  try {
    const { id } = req.jwt!;
    const existsAsync = promisify(redisClient.exists).bind(redisClient);
    const refreshToken = await existsAsync(id);

    if (refreshToken) {
      await redisClient.del(id);
      res.status(200).json({ message: "success logout" });
    } else {
      res.status(500).json({ message: "failed to logout" });
    }
  } catch (e) {
    res.status(500).json({ message: "failed to logout" });
  }
};

export const getProtected = (req: Request, res: Response) => {
  res.status(200).json({ message: "you are authorized" });
};

export const refreshJwt = async (req: Request, res: Response) => {
  const { authorization, refresh } = req.headers;

  if (authorization && refresh) {
    const tokenParts = authorization.split(" ");
    const refreshToken = refresh as string;

    const verification = <CustomJwtPayload>verify(tokenParts[1]);

    if (verification.name === "TokenExpiredError") {
      const decoded = <CustomJwtPayload>decode(tokenParts[1]);
      const user = await User.findOne({ where: { id: decoded.id } });

      if (user) {
        const refreshVerification = await verifyRefresh(
          refreshToken,
          decoded.id
        );

        const newAccessToken = sign(user);
        if (refreshVerification) {
          res.status(200).json({
            message: "success refresh",
            data: {
              accessToken: newAccessToken,
              refreshToken: refresh,
            },
          });
        } else {
          res.status(401).json({ message: "invalid refresh token" });
        }
      } else {
        return res.status(404).json({ message: "user not found" });
      }
    } else if (verification.name === "JsonWebTokenError") {
      res.status(401).json({ message: "invalid token" });
    } else {
      res.status(400).json({ message: "access token is not expired" });
    }
  } else {
    res
      .status(400)
      .json({ message: "access token and refresh token are need for refresh" });
  }
};
