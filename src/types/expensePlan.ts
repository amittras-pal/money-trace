import { Types } from "mongoose";

export type IExpensePlan = {
  _id?: Types.ObjectId;
  name: string;
  description: string;
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
