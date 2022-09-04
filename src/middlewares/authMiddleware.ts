import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload, verify } from "../lib/jwt";

export interface JwtRequest extends Request {
  jwt?: string | JwtPayload;
}

const authJwt = (req: JwtRequest, res: Response, next: NextFunction) => {
  const tokenParts = req.headers.authorization!.split(" ");

  if (
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = <CustomJwtPayload>verify(tokenParts[1]);
      req.jwt = verification;
      next();
    } catch (err) {
      res.status(401).json({ message: "You are not authorized" });
    }
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

export default authJwt;
