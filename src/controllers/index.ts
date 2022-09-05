import { Response } from "express";
import { Send, Query } from "express-serve-static-core";
import { JwtRequest } from "middlewares/authJwt";

export interface TypedRequestBody<T> extends JwtRequest {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends JwtRequest {
  query: T;
}

export interface TypedRequest<T extends Query, U> extends JwtRequest {
  body: U;
  query: T;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
