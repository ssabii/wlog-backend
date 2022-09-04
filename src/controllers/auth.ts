import { Request, Response, NextFunction } from "express";

import { TypedRequestBody } from ".";
import { redisClient } from "config/redis";
import { CustomJwtPayload, refresh, sign } from "lib/jwt";
import { generatePassword, validatePassword } from "lib/password";
import { JwtRequest } from "middlewares/authMiddleware";
import User from "models/User";

interface LoginRequestBody {
  username: string;
  password: string;
}

export const postLogin = (
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
};

interface RegisterRequestBody {
  username: string;
  password: string;
  display_name?: string;
}

export const postRegister = async (
  req: TypedRequestBody<RegisterRequestBody>,
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
    const { id } = req.jwt as CustomJwtPayload;
    const refreshToken = await redisClient.v4.exists(id);

    if (refreshToken) {
      await redisClient.v4.del(id);
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
