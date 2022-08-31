import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface JwtRequest extends Request {
  jwt?: string | JwtPayload;
}

const publicKey = process.env.JWT_PUBLIC_KEY!;

const authMiddleware = (req: JwtRequest, res: Response, next: NextFunction) => {
  const tokenParts = req.headers.authorization!.split(" ");
  if (
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jwt.verify(tokenParts[1], publicKey, {
        algorithms: ["RS256"],
      });
      req.jwt = verification;
      next();
    } catch (err) {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
  } else {
    res.status(401).json({ success: false, message: "You are not authorized" });
  }
};

export default authMiddleware;
