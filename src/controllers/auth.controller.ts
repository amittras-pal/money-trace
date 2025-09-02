import { compare, genSalt, hash } from "bcryptjs";
import { CookieOptions } from "express";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { sign } from "jsonwebtoken";
import { userMessages } from "../constants/apimessages";
import { SUSPUEND_REGISTRATION } from "../constants/common";
import { getEnv } from "../env/config";
import User from "../models/user.model";
import { TypedRequest, TypedResponse } from "../types/requests";
import { IUser } from "../types/user";

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
        "Email is already registered. Please use a different one. If you are the owner, please Login"
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
  }
);

/**
 * @description login a registered user
 * @method POST /api/user/login
 * @access public
 */
export const login = routeHandler(
  async (
    req: TypedRequest<{}, { email: string; pin: string }>,
    res: TypedResponse<IUser>
  ) => {
    const { email, pin } = req.body;
    if (!email || !pin) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Required Fields are not provided.");
    }

    const user: IUser | null = await User.findOne({ email }, { __v: false });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Email ID is not registered");
    } else if (await compare(email + pin, user.pin ?? "")) {
      delete user.pin;

      const { JWT_SECRET = "", TOKEN_TTL = "" } = getEnv();
      const token = sign({ id: user._id?.toString() ?? "" }, JWT_SECRET, {
        expiresIn: TOKEN_TTL,
      });
      const cookieMaxAge = parseInt(TOKEN_TTL) * 24 * 60 * 60 * 1000; // TOKEN_TTL is in days, converting to milliseconds
      const cookieOpts: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: cookieMaxAge,
      };
      res.cookie("token", token, cookieOpts).json({
        message: userMessages.loginSuccessful,
        response: user,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("Invalid Credentials!");
    }
  }
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
  }
);

/**
 * @description update details of a user
 * @method PUT /api/user/update
 * @access protected
 */
export const updateUserDetails = routeHandler(
  async (
    req: TypedRequest<{}, Partial<IUser>>,
    res: TypedResponse<IUser | null>
  ) => {
    await User.findByIdAndUpdate(req.userId, {
      $set: { ...req.body },
    });

    const update = await User.findById(req.userId);
    res.json({ message: userMessages.userDetailsUpdated, response: update });
  }
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
    res: TypedResponse
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
  }
);

/**
 * @description Update the login pin for the user.
 * @method POST /api/user/logout
 * @access public
 */
export const logout = routeHandler((_req: TypedRequest, res: TypedResponse) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out." });
});

/**
 * @description Delete user account and all associated data
 * @method DELETE /api/user/delete-account
 * @access protected
 */
export const deleteAccount = routeHandler(
  async (req: TypedRequest<{}, { pin: string }>, res: TypedResponse) => {
    const { userId } = req;
    const { pin } = req.body;

    console.log(req.body);

    // Get user data to validate pin
    const user: IUser | null = await User.findById(userId);

    // Validate pin similar to login
    const isValidPin = await compare(
      (user?.email ?? "") + parseInt(pin),
      user?.pin ?? ""
    );
    if (!isValidPin) {
      res.status(StatusCodes.FORBIDDEN);
      throw new Error("Invalid credentials. Account deletion denied.");
    }

    // TODO: Delete all user-related data in parallel
    // await Promise.all([
    //   Budget.deleteMany({ user: new Types.ObjectId(userId) }),
    //   Expense.deleteMany({ user: new Types.ObjectId(userId) }),
    //   ExpensePlan.deleteMany({ user: new Types.ObjectId(userId) }),
    //   User.findByIdAndDelete(userId),
    // ]);

    // Clear the authentication cookie, logs the user out.
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({
      message: "Account and all associated data deleted successfully.",
    });
  }
);
