import { compare, genSalt, hash } from "bcryptjs";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { sign } from "jsonwebtoken";
import { userMessages } from "../constants/apimessages";
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
    if (!userName || !email || !pin || !req.body.timeZone) {
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
    let encryptedRecoveryAnswer = "";
    if (req.body.recoveryAnswer)
      encryptedRecoveryAnswer = await hash(req.body.recoveryAnswer, salt);

    const created = await User.create({
      userName,
      email,
      pin: encryptedPin,
      timeZone: req.body.timeZone,
      recoveryChallenge: req.body.recoveryChallenge ?? null,
      recoveryAnswer: req.body.recoveryAnswer ? encryptedRecoveryAnswer : null,
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
      const update: IUser | null = await User.findByIdAndUpdate(
        user._id,
        {
          lastActive: new Date(),
          lastLogin: new Date(),
        },
        { new: true }
      );
      if (update) {
        delete update.pin;
        delete update.recoveryAnswer;
        res.json({
          message: userMessages.loginSuccessful,
          response: {
            user: update,
            token: sign({ id: update._id }, JWT_SECRET, {
              expiresIn: "7d",
            }),
          },
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        throw new Error("Failed to register your login.");
      }
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
 * @description checks if an email is registered in the database
 * @method GET /api/user/exists
 * @access public
 */
export const checkUserExists = routeHandler(
  async (req: TypedRequest<{ email: string }, {}>, res: TypedResponse) => {
    const exists = await User.exists({ email: req.query.email });
    if (exists) {
      res.status(StatusCodes.CONFLICT);
      throw new Error("Email already registered.");
    }

    res.json({ message: "Email can be registered" });
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
