import { Types } from "mongoose";

export type IExpensePlan = {
  _id?: Types.ObjectId;
  name: String;
  description: String;
  user: Types.ObjectId;
  open: Boolean;
};
