import { Types } from "mongoose";

export type IUser = {
  _id?: Types.ObjectId;
  userName: string;
  email: string;
  pin?: string;
  timeZone: string;
  editWindow: number;
};
