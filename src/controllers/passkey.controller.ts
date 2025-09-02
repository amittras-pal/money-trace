import { generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import User from "../models/user.model";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description Get user by email for passkey operations
 * @method GET /api/passkey/init
 * @access public
 */
export const initializePasskeyRegistration = routeHandler(
  async (req: TypedRequest, res: TypedResponse<any>) => {
    console.log("Called.");

    const user = await User.findOne(
      { _id: new Types.ObjectId(req.userId) },
      { pin: false, __v: false }
    );
    if (!user) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("User not found with the provided email.");
    }

    const options = await generateRegistrationOptions({
      rpID: "localhost",
      rpName: "Expensary",
      userID: isoUint8Array.fromUTF8String(user.id.toString()),
      userName: user._id.toString(),
      userDisplayName: user.userName,
    });

    console.log(options);

    res.status(StatusCodes.OK).json({
      message: "Passkey Registration initialized!",
      response: options,
    });
  }
);
