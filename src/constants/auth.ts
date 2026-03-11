export const AUTH_COOKIES = Object.freeze({
  legacyToken: "token",
  activeAccount: "mt_active_account",
  sessionPrefix: "mt_session_",
});

export const AUTH_ERROR_CODES = Object.freeze({
  reauthRequired: "REAUTH_REQUIRED",
  noActiveSession: "NO_ACTIVE_SESSION",
  activeSessionExpired: "ACTIVE_SESSION_EXPIRED",
  maxDeviceAccountsReached: "MAX_DEVICE_ACCOUNTS_REACHED",
  invalidCredentials: "INVALID_CREDENTIALS",
});

export const DEFAULT_MAX_DEVICE_ACCOUNTS = 5;
