import { Types } from "mongoose";

/**
 *
 * This type is used for creating the Expense Model
 */
export type IExpense = {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  categoryId: Types.ObjectId | string;
  user: Types.ObjectId;
  plan?: Types.ObjectId | null;
  amount: Number;
  reverted: Boolean;
  linked: Types.ObjectId | string;
};
