import { model, Schema } from "mongoose";
import { IExpense } from "../types/expense";

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 400, default: "" },
    date: { type: Date, default: Date.now },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    plan: { type: Schema.Types.ObjectId, ref: "ExpensePlan", default: null },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: false, default: 0 },
    reverted: { type: Boolean, required: true, default: false },
    linked: { type: Schema.Types.ObjectId, ref: "Expense", default: null },
  },
  { timestamps: false }
);

const Expense = model("Expense", expenseSchema);
export default Expense;
