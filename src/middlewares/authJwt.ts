import { NextFunction, Request, Response } from "express";
import { CustomJwtPayload, verify } from "lib/jwt";

export interface JwtRequest extends Request {
  jwt?: CustomJwtPayload;
}

const authJwt = (req: JwtRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ message: "You are not authorized" });
    return;
  }

  const tokenParts = authorization.split(" ");

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
