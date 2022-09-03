import express, { NextFunction, Request, Response } from "express";
import { Send, Query } from "express-serve-static-core";

import authRouter from "./auth";

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}

export interface TypedRequest<T extends Query, U> extends Request {
  body: U;
  query: T;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

const router = express.Router();

router.use(authRouter);

export default router;
