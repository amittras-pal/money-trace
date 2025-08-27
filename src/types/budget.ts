import { Types } from "mongoose";

export type IBudget = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  month: number;
  year: number;
  amount: number;
  remarks?: string;
};
