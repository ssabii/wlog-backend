import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import CustomError from "lib/errors/CustomError";
import StatusCode from "lib/errors/enums/StatusCode";
import { CustomJwtPayload, verify } from "lib/jwt";

export interface JwtRequest extends Request {
  jwt?: CustomJwtPayload;
}

const authJwt = (req: JwtRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new CustomError(StatusCode.UNAUTHORIZED, "not authorized"));
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
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        next(new CustomError(StatusCode.UNAUTHORIZED, "token expired"));
      } else {
        next(new CustomError(StatusCode.UNAUTHORIZED, "invalide token"));
      }
    }
  } else {
    next(new CustomError(StatusCode.UNAUTHORIZED, "not authorized"));
  }
};

export default authJwt;
