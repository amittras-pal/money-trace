import { CookieOptions, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import {
  AUTH_COOKIES,
  DEFAULT_MAX_DEVICE_ACCOUNTS,
} from "../constants/auth";
import { getEnv } from "../env/config";
import { AuthTokenPayload } from "../types/requests";

const DEFAULT_TOKEN_TTL = "10d";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const TTL_WITH_UNIT_REGEX = /^(\d+)(ms|s|m|h|d|w)$/i;

const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: DAY_IN_MS,
  w: 7 * DAY_IN_MS,
};

type TokenTTLConfig = {
  jwtExpiresIn: string;
  cookieMaxAgeMs: number;
};

function parseTTLWithUnit(ttl: string): TokenTTLConfig | null {
  const match = TTL_WITH_UNIT_REGEX.exec(ttl);
  if (!match) return null;

  const value = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (Number.isNaN(value) || value <= 0 || !UNIT_TO_MS[unit]) return null;

  return {
    jwtExpiresIn: `${value}${unit}`,
    cookieMaxAgeMs: value * UNIT_TO_MS[unit],
  };
}

function parseLegacyDayTTL(ttl: string): TokenTTLConfig | null {
  if (!/^\d+$/.test(ttl)) return null;

  const days = Number.parseInt(ttl, 10);
  if (Number.isNaN(days) || days <= 0) return null;

  return {
    jwtExpiresIn: `${days}d`,
    cookieMaxAgeMs: days * DAY_IN_MS,
  };
}

function getDefaultTTLConfig(): TokenTTLConfig {
  return {
    jwtExpiresIn: DEFAULT_TOKEN_TTL,
    cookieMaxAgeMs: 10 * DAY_IN_MS,
  };
}

function resolveTokenTTLConfig(): TokenTTLConfig {
  const { TOKEN_TTL = "" } = getEnv();
  const normalized = TOKEN_TTL.trim().toLowerCase();

  if (!normalized) return getDefaultTTLConfig();

  const durationTTL = parseTTLWithUnit(normalized);
  if (durationTTL) return durationTTL;

  // Backward compatibility: plain numeric values are treated as days.
  const legacyDayTTL = parseLegacyDayTTL(normalized);
  if (legacyDayTTL) return legacyDayTTL;

  return getDefaultTTLConfig();
}

function getCookieMaxAge(): number {
  return resolveTokenTTLConfig().cookieMaxAgeMs;
}

export function getTokenTTLForJWT(): string {
  return resolveTokenTTLConfig().jwtExpiresIn;
}

function getCookieBaseOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };
}

export function getSessionCookieOptions(): CookieOptions {
  return {
    ...getCookieBaseOptions(),
    maxAge: getCookieMaxAge(),
  };
}

export function getCookieClearOptions(): CookieOptions {
  return getCookieBaseOptions();
}

export function getSessionCookieName(accountId: string): string {
  return `${AUTH_COOKIES.sessionPrefix}${accountId}`;
}

function getSessionAccountId(cookieName: string): string | null {
  if (!cookieName.startsWith(AUTH_COOKIES.sessionPrefix)) return null;
  const accountId = cookieName.slice(AUTH_COOKIES.sessionPrefix.length);
  return accountId || null;
}

export function getSessionAccountIds(req: Request): string[] {
  const cookieMap = (req.cookies ?? {}) as Record<string, string | undefined>;
  const accountIds = Object.keys(cookieMap)
    .map((cookieName) => getSessionAccountId(cookieName))
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(accountIds));
}

export function getAccountSessionToken(
  req: Request,
  accountId: string,
): string | undefined {
  const cookieMap = (req.cookies ?? {}) as Record<string, string | undefined>;
  return cookieMap[getSessionCookieName(accountId)];
}

export function getActiveAccountId(req: Request): string | undefined {
  const cookieMap = (req.cookies ?? {}) as Record<string, string | undefined>;
  return cookieMap[AUTH_COOKIES.activeAccount];
}

export function getLegacyToken(req: Request): string {
  const cookieMap = (req.cookies ?? {}) as Record<string, string | undefined>;
  return cookieMap[AUTH_COOKIES.legacyToken] ?? "";
}

export function parseUserIdFromToken(token: string, secret: string): string {
  const value = verify(token, secret) as AuthTokenPayload;
  if (!value.id) {
    throw new JsonWebTokenError("Invalid session payload");
  }

  return value.id;
}

export type ActiveAccountValidationResult =
  | { status: "ok"; userId: string }
  | { status: "missing-token" }
  | { status: "invalid-session"; message: string };

export function validateActiveAccountSession(
  req: Request,
  activeAccountId: string,
  secret: string,
): ActiveAccountValidationResult {
  const token = getAccountSessionToken(req, activeAccountId);
  if (!token) {
    return { status: "missing-token" };
  }

  try {
    const userId = parseUserIdFromToken(token, secret);
    if (userId !== activeAccountId) {
      return {
        status: "invalid-session",
        message: "Active account session is invalid.",
      };
    }

    return { status: "ok", userId };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return { status: "invalid-session", message: error.message };
    }

    throw error;
  }
}

export type LegacyTokenValidationResult =
  | { status: "none" }
  | { status: "ok"; userId: string; token: string }
  | { status: "invalid-session"; message: string };

export function validateLegacySessionToken(
  req: Request,
  secret: string,
): LegacyTokenValidationResult {
  const legacyToken = getLegacyToken(req);
  if (!legacyToken) {
    return { status: "none" };
  }

  try {
    const userId = parseUserIdFromToken(legacyToken, secret);
    return { status: "ok", userId, token: legacyToken };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return { status: "invalid-session", message: error.message };
    }

    throw error;
  }
}

export function setAccountSessionCookie(
  res: Response,
  accountId: string,
  token: string,
): void {
  res.cookie(getSessionCookieName(accountId), token, getSessionCookieOptions());
}

export function clearAccountSessionCookie(
  res: Response,
  accountId: string,
): void {
  res.clearCookie(getSessionCookieName(accountId), getCookieClearOptions());
}

export function setActiveAccountCookie(res: Response, accountId: string): void {
  res.cookie(AUTH_COOKIES.activeAccount, accountId, getSessionCookieOptions());
}

export function clearActiveAccountCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIES.activeAccount, getCookieClearOptions());
}

export function setLegacyTokenCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIES.legacyToken, token, getSessionCookieOptions());
}

export function clearLegacyTokenCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIES.legacyToken, getCookieClearOptions());
}

export function getMaxDeviceAccounts(): number {
  const { MAX_DEVICE_ACCOUNTS = "" } = getEnv();
  const parsed = Number.parseInt(MAX_DEVICE_ACCOUNTS, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_MAX_DEVICE_ACCOUNTS;
  }

  return parsed;
}
