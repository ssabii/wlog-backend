import { NextFunction, Request, Response } from "express";

import StatusCode from "lib/errors/enums/StatusCode";
import User from "models/User";
import authService from "services/auth";
import settingService from "services/setting";
import { APIResponse, Empty, JwtRequest } from ".";

interface LoginDetails {
  username: string;
  password: string;
}

export const login = async (
  req: Request<Empty, APIResponse<User>, LoginDetails>,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const { accessToken, refreshToken } = await authService.login(
      username,
      password
    );

    res.status(StatusCode.OK).json({
      message: "success login",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    return next(e);
  }
};

interface RegisterDetails extends LoginDetails {
  displayName?: string;
}

export const register = async (
  req: Request<Empty, APIResponse<User>, RegisterDetails>,
  res: Response,
  next: NextFunction
) => {
  const { username, password, displayName } = req.body;

  try {
    const user = await authService.register(username, password, displayName);
    await settingService.createSetting(username);

    res
      .status(StatusCode.CREATED)
      .json({ message: "user created", data: user });
  } catch (e) {
    return next(e);
  }
};

export const renderLogin = (req: Request, res: Response) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/api/v1/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
};

export const renderRegister = (req: Request, res: Response) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
};

export const logout = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.jwt!;

    await authService.logout(id);
    res.status(StatusCode.OK).json({ message: "success logout" });
  } catch (e) {
    return next(e);
  }
};

export const renderProtected = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({ message: "you are authorized" });
};

export const refreshJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = await authService.refresh(
      req.headers
    );
    res.status(StatusCode.OK).json({
      message: "success refresh",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    return next(e);
  }
};
