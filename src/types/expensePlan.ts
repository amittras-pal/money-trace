import { Types } from "mongoose";

export type IExpensePlan = {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  user: Types.ObjectId;
  open: Boolean;
  /** Optional execution range to scope the plan (inclusive). */
  executionRange?: {
    from?: Date; // start date of the plan window
    to?: Date; // end date of the plan window
  };
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
