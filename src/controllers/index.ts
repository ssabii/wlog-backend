import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { CustomJwtPayload } from "lib/jwt";

export interface JwtRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  jwt?: CustomJwtPayload;
}

export interface BaseParams<IDType = number> {
  id: IDType;
}

export interface APIResponse<Data> {
  data: Data;
  message: string;
}

export interface Empty {}
