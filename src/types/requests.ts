import { Request, Response } from "express";
import { Query, Send } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";

export interface TypedRequest<QueryParams extends Query = {}, Body = {}>
  extends Request {
  query: QueryParams;
  body: Body;
  userId?: string;
}

export interface TypedResponse<Body = {}> extends Response {
  json: Send<{ message: string; stack?: string | null; response?: Body }, this>;
}

export interface AuthTokenPayload extends JwtPayload {
  id?: string;
}
