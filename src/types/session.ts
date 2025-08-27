import { Types } from "mongoose";

export type ISession = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  userAgent: string;
  deviceId: string;
  refreshTokenHash: string;
  createdAt?: Date;
  expireAt?: Date;
  revoked?: boolean;
};
