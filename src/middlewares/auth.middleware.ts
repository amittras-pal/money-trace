import { compareSync } from "bcryptjs";
import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AUTH_ERROR_CODES } from "../constants/auth";
import { getEnv } from "../env/config";
import { ApiError } from "../types/errors";
import { TypedRequest, TypedResponse } from "../types/requests";
import {
  clearAccountSessionCookie,
  clearActiveAccountCookie,
  clearLegacyTokenCookie,
  getActiveAccountId,
  setAccountSessionCookie,
  setActiveAccountCookie,
  validateActiveAccountSession,
  validateLegacySessionToken,
} from "../utils/auth-session";

const authenticate: RequestHandler = (
  req: TypedRequest,
  res: TypedResponse,
  next: NextFunction,
) => {
  const { JWT_SECRET = "" } = getEnv();
  const activeAccountId = getActiveAccountId(req);

  if (activeAccountId) {
    const activeSession = validateActiveAccountSession(
      req,
      activeAccountId,
      JWT_SECRET,
    );

    if (activeSession.status === "missing-token") {
      clearActiveAccountCookie(res);
      clearLegacyTokenCookie(res);

      res.status(StatusCodes.UNAUTHORIZED);
      throw new ApiError(
        "No active session found for selected account.",
        AUTH_ERROR_CODES.noActiveSession,
      );
    }

    if (activeSession.status === "invalid-session") {
      clearAccountSessionCookie(res, activeAccountId);
      clearActiveAccountCookie(res);
      clearLegacyTokenCookie(res);

      res.status(StatusCodes.UNAUTHORIZED);
      throw new ApiError(
        activeSession.message,
        AUTH_ERROR_CODES.activeSessionExpired,
      );
    }

    req.userId = activeSession.userId;
    next();
    return;
  }

  const legacySession = validateLegacySessionToken(req, JWT_SECRET);
  if (legacySession.status === "invalid-session") {
    clearLegacyTokenCookie(res);

    res.status(StatusCodes.UNAUTHORIZED);
    throw new ApiError(
      legacySession.message,
      AUTH_ERROR_CODES.activeSessionExpired,
    );
  }

  if (legacySession.status === "ok") {
    req.userId = legacySession.userId;

    // Progressive migration from single-session clients.
    setAccountSessionCookie(res, legacySession.userId, legacySession.token);
    setActiveAccountCookie(res, legacySession.userId);

    next();
    return;
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
