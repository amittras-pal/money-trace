import { compare, genSalt, hash } from "bcrypt";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { sign } from "jsonwebtoken";
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
    const { userName, email, pin } = req.body;
    if (!userName || !email || !pin) {
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
    });

    if (created)
      res.status(StatusCodes.OK).json({
        message:
          "You are successfully registerd. Please login with your new user account",
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
    req: TypedRequest<{}, Partial<IUser>>,
    res: TypedResponse<{ user: IUser; token: string }>
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
      const { JWT_SECRET = "" } = getEnv();
      delete user.pin;
      res.json({
        message: "Login Successful!!",
        response: {
          user,
          token: sign({ id: user._id } ?? "", JWT_SECRET, {
            expiresIn: "7d",
          }),
        },
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
      message: "User Details Retrieved Successfully!",
      response: user,
    });
  }
);
