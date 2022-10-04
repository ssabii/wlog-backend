import { NextFunction, Request, Response } from "express";
import CustomError from "lib/errors/CustomError";
import StatusCode from "lib/errors/enums/StatusCode";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.code).json(err);
  }
  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(err.message);
};

export default errorHandler;
