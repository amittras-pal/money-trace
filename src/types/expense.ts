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
  amount: number;
  reverted: boolean;
  linked: Types.ObjectId | string;
};

export type SummarizedCategory = {
  value: number;
  label: string;
  color: string;
  group: string;
  icon: string;
};
