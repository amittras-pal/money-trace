import { Types } from "mongoose";

export type IExpensePlan = {
  _id?: Types.ObjectId;
  name: String;
  description: String;
  user: Types.ObjectId;
  open: Boolean;
  createdAt?: string;
  updatedAt?: string;
  lastAction:
  | "Created"
  | "Updated"
  | "Expense Added"
  | "Expense Updated"
  | "Expense Removed"
  | "Closed";
};
