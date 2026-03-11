import { compare, genSalt, hash } from "bcryptjs";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { userMessages } from "../constants/apimessages";
import { AUTH_ERROR_CODES } from "../constants/auth";
import { SUSPUEND_REGISTRATION } from "../constants/common";
import { getEnv } from "../env/config";
import User from "../models/user.model";
import { ApiError } from "../types/errors";
import {
  AuthTokenPayload,
  TypedRequest,
  TypedResponse,
} from "../types/requests";
import { IUser } from "../types/user";
import {
  clearAccountSessionCookie,
  clearActiveAccountCookie,
  clearLegacyTokenCookie,
  getAccountSessionToken,
  getActiveAccountId,
  getMaxDeviceAccounts,
  getSessionAccountIds,
  getTokenTTLForJWT,
  setAccountSessionCookie,
  setActiveAccountCookie,
  setLegacyTokenCookie,
} from "../utils/auth-session";

function throwApiError<Body>(
  res: TypedResponse<Body>,
  status: number,
  message: string,
  code?: string,
): never {
  res.status(status);
  throw new ApiError(message, code);
}

/**
 * @description register a new user with unique email address
 * @method POST /api/user/register
 * @access public
 */
export const register = routeHandler(
  async (req: TypedRequest<{}, Partial<IUser>>, res: TypedResponse) => {
    // Indefinitely suspending registration of new users.
    // May revoke the lock sometime in the future.
    if (SUSPUEND_REGISTRATION) {
      res.status(StatusCodes.GONE);
      throw new Error("No Longer Accepting Registrations.");
    }

    const { userName, email, pin, timeZone } = req.body;
    if (!userName || !email || !pin || !timeZone) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all the required fields.");
    }

    const userInDb: IUser | null = await User.findOne({ email });
    if (userInDb !== null) {
      res.status(StatusCodes.CONFLICT);
      throw new Error(
        "Email is already registered. Please use a different one. If you are the owner, please Login",
      );
    }

    const salt: string = await genSalt();
    const encryptedPin: string = await hash(email + pin, salt);
    const created = await User.create({
      userName,
      email,
      pin: encryptedPin,
      timeZone,
    });

    if (created)
      res.status(StatusCodes.CREATED).json({
        message: userMessages.successfullyRegisterd,
      });
    else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error("Something went wrong while creating your account.");
    }
  },
);

/**
 * @description login a registered user
 * @method POST /api/user/login
 * @access public
 */
export const login = routeHandler(
  async (
    req: TypedRequest<{}, { email: string; pin: string }>,
    res: TypedResponse<IUser>,
  ) => {
    const { email, pin } = req.body;
    if (!email || !pin) {
      throwApiError(
        res,
        StatusCodes.BAD_REQUEST,
        "Required Fields are not provided.",
      );
    }

    const user: IUser | null = await User.findOne({ email }, { __v: false });
    if (!user) {
      throwApiError(res, StatusCodes.NOT_FOUND, "Email ID is not registered");
    }

    const validCredentials = await compare(email + pin, user.pin ?? "");
    if (!validCredentials) {
      throwApiError(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid Credentials!",
        AUTH_ERROR_CODES.invalidCredentials,
      );
    }

    delete user.pin;

    const accountId = user._id?.toString() ?? "";
    if (!accountId) {
      throwApiError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to establish account session.",
      );
    }

    const maxDeviceAccounts = getMaxDeviceAccounts();
    const activeSessionAccountIds = getSessionAccountIds(req);
    const accountAlreadySaved = activeSessionAccountIds.includes(accountId);

    if (
      !accountAlreadySaved &&
      activeSessionAccountIds.length >= maxDeviceAccounts
    ) {
      throwApiError(
        res,
        StatusCodes.CONFLICT,
        `This device has reached the max limit of ${maxDeviceAccounts} active accounts.`,
        AUTH_ERROR_CODES.maxDeviceAccountsReached,
      );
    }

    const { JWT_SECRET = "" } = getEnv();
    const token = sign({ id: accountId }, JWT_SECRET, {
      expiresIn: getTokenTTLForJWT(),
    });

    setAccountSessionCookie(res, accountId, token);
    setActiveAccountCookie(res, accountId);

    // Legacy cookie fallback during migration from single-session clients.
    setLegacyTokenCookie(res, token);

    res.json({
      message: userMessages.loginSuccessful,
      response: user,
      sessionMeta: {
        activeAccountId: accountId,
        maxDeviceAccounts,
      },
    });
  },
);

/**
 * @description switch active account to another valid device session
 * @method POST /api/user/switch-active-account
 * @access public
 */
export const switchActiveAccount = routeHandler(
  async (
    req: TypedRequest<{}, { accountId: string }>,
    res: TypedResponse<IUser>,
  ) => {
    const { accountId } = req.body;
    if (!accountId) {
      throwApiError(
        res,
        StatusCodes.BAD_REQUEST,
        "Target accountId is required.",
      );
    }

    const token = getAccountSessionToken(req, accountId);
    if (!token) {
      throwApiError(
        res,
        StatusCodes.UNAUTHORIZED,
        userMessages.targetSessionRequiresReAuthentication,
        AUTH_ERROR_CODES.reauthRequired,
      );
    }

    const { JWT_SECRET = "" } = getEnv();

    try {
      const tokenPayload = verify(token, JWT_SECRET) as AuthTokenPayload;
      const tokenUserId = tokenPayload.id ?? "";

      if (!tokenUserId || tokenUserId !== accountId) {
        clearAccountSessionCookie(res, accountId);
        throwApiError(
          res,
          StatusCodes.UNAUTHORIZED,
          userMessages.targetSessionRequiresReAuthentication,
          AUTH_ERROR_CODES.reauthRequired,
        );
      }

      const user = await User.findById(tokenUserId, { __v: false, pin: false });
      if (!user) {
        clearAccountSessionCookie(res, accountId);
        throwApiError(
          res,
          StatusCodes.UNAUTHORIZED,
          userMessages.targetSessionRequiresReAuthentication,
          AUTH_ERROR_CODES.reauthRequired,
        );
      }

      setActiveAccountCookie(res, accountId);

      // Legacy cookie fallback during migration from single-session clients.
      setLegacyTokenCookie(res, token);

      res.status(StatusCodes.OK).json({
        message: userMessages.activeAccountSwitched,
        response: user,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof JsonWebTokenError) {
        clearAccountSessionCookie(res, accountId);
        throwApiError(
          res,
          StatusCodes.UNAUTHORIZED,
          userMessages.targetSessionRequiresReAuthentication,
          AUTH_ERROR_CODES.reauthRequired,
        );
      }

      throwApiError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong",
      );
    }
  },
);

/**
 * This endpoint is not required,
 * We're sending the user Object on successful login
 * It's an example of a protected endpoint utilizing the auth middleware.
 * @description get details of a user
 * @method POST /api/user/details
 * @access protected
 */
export const getUserDetails = routeHandler(
  async (req: TypedRequest, res: TypedResponse<IUser>) => {
    const user = await User.findById(req.userId, { password: false });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("User not Found!");
    }

    res.status(StatusCodes.OK).json({
      message: userMessages.userDetailsRetrievedSuccessfully,
      response: user,
    });
  },
);

/**
 * @description update details of a user
 * @method PUT /api/user/update
 * @access protected
 */
export const updateUserDetails = routeHandler(
  async (
    req: TypedRequest<{}, Partial<IUser>>,
    res: TypedResponse<IUser | null>,
  ) => {
    await User.findByIdAndUpdate(req.userId, {
      $set: { ...req.body },
    });

    const update = await User.findById(req.userId);
    res.json({ message: userMessages.userDetailsUpdated, response: update });
  },
);

/**
 * @description Update the login pin for the user.
 * @method PUT /api/user/update-login-key
 * @access public
 */
export const changePassword = routeHandler(
  async (
    req: TypedRequest<
      {},
      {
        email: string;
        currentPin: number;
        newPin: number;
        confirmNewPin: number;
      }
    >,
    res: TypedResponse,
  ) => {
    const { currentPin, newPin, confirmNewPin, email } = req.body;

    if (!currentPin || !newPin || !confirmNewPin) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please add all required fields.");
    }

    if (newPin !== confirmNewPin) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("New passwords don't match.");
    }

    const user: IUser | null = await User.findById(req.userId);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Email ID is not registered");
    } else if (await compare(email + currentPin, user.pin ?? "")) {
      const salt: string = await genSalt();
      const newEncryptedPin: string = await hash(email + newPin, salt);
      await User.findByIdAndUpdate(req.userId, {
        $set: { pin: newEncryptedPin },
      });
      res.json({ message: "Pin Changed Successfully!!" });
    } else {
      res.status(StatusCodes.FORBIDDEN);
      throw new Error("Current Pin Invalid.");
    }
  },
);

/**
 * @description Update the login pin for the user.
 * @method POST /api/user/logout
 * @access public
 */
export const logout = routeHandler(
  (
    req: TypedRequest<{}, { scope?: "current" | "all" }>,
    res: TypedResponse<{ remainingAccountIds: string[] }>,
  ) => {
    const scope = req.body?.scope === "all" ? "all" : "current";
    const accountIds = getSessionAccountIds(req);
    const activeAccountId = getActiveAccountId(req);

    if (scope === "all") {
      accountIds.forEach((accountId) => {
        clearAccountSessionCookie(res, accountId);
      });

      clearActiveAccountCookie(res);
      clearLegacyTokenCookie(res);

      res.json({
        message: userMessages.logoutSuccessful,
        response: { remainingAccountIds: [] },
      });
      return;
    }

    if (activeAccountId) {
      clearAccountSessionCookie(res, activeAccountId);
    }

    clearActiveAccountCookie(res);
    clearLegacyTokenCookie(res);

    const remainingAccountIds = accountIds.filter(
      (accountId) => accountId !== activeAccountId,
    );

    res.json({
      message: userMessages.logoutSuccessful,
      response: { remainingAccountIds },
    });
  },
);
