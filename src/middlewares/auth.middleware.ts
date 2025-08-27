import { compareSync } from "bcryptjs";
import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../constants/common";
import { getEnv } from "../env/config";
import {
  AuthTokenPayload,
  TypedRequest,
  TypedResponse,
} from "../types/requests";

const authenticate: RequestHandler = (
  req: TypedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  const token = req.cookies[ACCESS_TOKEN];
  if (token) {
    const { ACCESS_TOKEN_PK = "" } = getEnv();
    try {
      const value = verify(token, ACCESS_TOKEN_PK) as AuthTokenPayload;
      req.userId = value.id;
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.clearCookie(ACCESS_TOKEN);
        throw new Error(error.message);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        throw new Error("Something went wrong");
      }
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("No Token.");
  }
};

export const systemGate: RequestHandler = (
  req: TypedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  if (req.headers["x-sys-gate"]) {
    const { SYS_ADM_SECRET = "" } = getEnv();
    const key = req.headers["x-sys-gate"].toString();
    if (compareSync(key, SYS_ADM_SECRET)) next();
    else {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("Unauthorised System Access...");
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("No Token.");
  }
};

export default authenticate;
