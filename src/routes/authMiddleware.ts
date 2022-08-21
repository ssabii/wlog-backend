import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (req.isAuthenticated() && user.admin) {
    next();
  } else {
    res.status(401).json({ message: "You are not admin" });
  }
};
