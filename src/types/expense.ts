import { Types } from "mongoose";

/**
 *
 * This type is used for creating the Expense Model
 */
export type IExpense = {
  _id?: Types.ObjectId;
  title: String;
  description: String;
  date: Date;
  category: String;
  subCategory: String;
  user: Types.ObjectId;
  plan?: Types.ObjectId;
  amount: Number;
  reverted: Boolean;
};
