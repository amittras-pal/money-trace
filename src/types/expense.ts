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
  categoryId: Types.ObjectId | String;
  user: Types.ObjectId;
  plan?: Types.ObjectId | null;
  amount: Number;
  reverted: Boolean;
  copied: Boolean;
};
