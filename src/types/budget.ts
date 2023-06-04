import { Types } from "mongoose";

export type IBudget = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  month: Number;
  year: Number;
  amount: Number;
};
