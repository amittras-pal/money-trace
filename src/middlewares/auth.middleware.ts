import { compareSync } from "bcryptjs";
import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { AUTH_COOKIES, AUTH_ERROR_CODES } from "../constants/auth";
import { getEnv } from "../env/config";
import { ApiError } from "../types/errors";
import {
  AuthTokenPayload,
  TypedRequest,
  TypedResponse,
} from "../types/requests";
import {
  clearAccountSessionCookie,
  clearActiveAccountCookie,
  clearLegacyTokenCookie,
  getAccountSessionToken,
  getActiveAccountId,
  setAccountSessionCookie,
  setActiveAccountCookie,
} from "../utils/auth-session";

function parseUserIdFromToken(token: string, secret: string): string {
  const value = verify(token, secret) as AuthTokenPayload;
  if (!value.id) {
    throw new JsonWebTokenError("Invalid session payload");
  }

  return value.id;
}

const authenticate: RequestHandler = (
  req: TypedRequest,
  res: TypedResponse,
  next: NextFunction,
) => {
  const { JWT_SECRET = "" } = getEnv();
  const activeAccountId = getActiveAccountId(req);

  if (activeAccountId) {
    const token = getAccountSessionToken(req, activeAccountId);
    if (!token) {
      clearActiveAccountCookie(res);
      clearLegacyTokenCookie(res);

      res.status(StatusCodes.UNAUTHORIZED);
      throw new ApiError(
        "No active session found for selected account.",
        AUTH_ERROR_CODES.noActiveSession,
      );
    }

    try {
      const userId = parseUserIdFromToken(token, JWT_SECRET);
      if (userId !== activeAccountId) {
        clearAccountSessionCookie(res, activeAccountId);
        clearActiveAccountCookie(res);
        clearLegacyTokenCookie(res);

        res.status(StatusCodes.UNAUTHORIZED);
        throw new ApiError(
          "Active account session is invalid.",
          AUTH_ERROR_CODES.activeSessionExpired,
        );
      }

      req.userId = userId;
      next();
      return;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof JsonWebTokenError) {
        clearAccountSessionCookie(res, activeAccountId);
        clearActiveAccountCookie(res);
        clearLegacyTokenCookie(res);

        res.status(StatusCodes.UNAUTHORIZED);
        throw new ApiError(
          error.message,
          AUTH_ERROR_CODES.activeSessionExpired,
        );
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        throw new Error("Something went wrong");
      }
    }
  }

  const legacyToken = (req.cookies?.[AUTH_COOKIES.legacyToken] ?? "") as string;
  if (legacyToken) {
    try {
      const userId = parseUserIdFromToken(legacyToken, JWT_SECRET);

      req.userId = userId;

      // Progressive migration from single-session clients.
      setAccountSessionCookie(res, userId, legacyToken);
      setActiveAccountCookie(res, userId);

      next();
      return;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        clearLegacyTokenCookie(res);

        res.status(StatusCodes.UNAUTHORIZED);
        throw new ApiError(
          error.message,
          AUTH_ERROR_CODES.activeSessionExpired,
        );
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error("Something went wrong");
    }
  }

  res.status(StatusCodes.UNAUTHORIZED);
  throw new ApiError("No Token.", AUTH_ERROR_CODES.noActiveSession);
};

export const systemGate: RequestHandler = (
  req: TypedRequest,
  res: TypedResponse,
  next: NextFunction,
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
