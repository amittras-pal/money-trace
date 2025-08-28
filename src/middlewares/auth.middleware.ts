import { compareSync } from "bcryptjs";
import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, verify } from "jsonwebtoken";
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
  const token = req.cookies.token;
  if (token) {
    const { JWT_SECRET = "" } = getEnv();
    try {
      const value = verify(token, JWT_SECRET) as AuthTokenPayload;
      req.userId = value.id;
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.clearCookie("token");
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
