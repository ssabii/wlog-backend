import { JwtRequest } from "controllers/index";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { validationResult } from "express-validator";
import StatusCode from "lib/errors/enums/StatusCode";

const validate = <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
>(
  req: JwtRequest<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req as unknown as Request);
  const message = errors.array()[0].msg;

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(StatusCode.BAD_REQUEST).json({ message });
};

export default validate;
