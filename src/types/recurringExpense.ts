import { Types } from "mongoose";

export type IRecurringExpense = {
  _id?: Types.ObjectId;
  /** Display title carried over to the generated expense. */
  title: string;
  /** Optional description carried over to the generated expense. */
  description: string;
  /** Category reference carried over to the generated expense. */
  categoryId: Types.ObjectId | string;
  /** Owner user. */
  user: Types.ObjectId;
  /** Default amount for the generated expense. */
  amount: number;
  /** Day of the month (1–28) on which the expense should be created. */
  dayOfMonth: number;
  /** Whether this recurring rule is currently active. */
  active: boolean;
  /** Month (0-11) when an expense was last created from this rule. */
  lastCreatedMonth: number;
  /** Year when an expense was last created from this rule. */
  lastCreatedYear: number;
  /** Exact timestamp of the last successful processing. */
  lastProcessedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};
