import { model, Schema } from "mongoose";
import { IExpense } from "../types/expense";

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 400, default: "" },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      required: [true, "Please add the category"],
    },
    subCategory: {
      type: String,
      required: [true, "Please add the sub-category"],
    },
    plan: { type: Schema.Types.ObjectId, ref: "ExpensePlan", default: null },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    reverted: { type: Boolean, required: true, default: false },
  },
  { timestamps: false }
);

const Expense = model("Expense", expenseSchema);
export default Expense;
