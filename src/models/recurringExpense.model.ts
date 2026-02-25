import { model, Schema } from "mongoose";
import { IRecurringExpense } from "../types/recurringExpense";

const recurringExpenseSchema = new Schema<IRecurringExpense>(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 400, default: "" },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true, default: 0 },
    dayOfMonth: { type: Number, required: true, min: 1, max: 28 },
    active: { type: Boolean, default: true },
    lastCreatedMonth: { type: Number, default: -1 },
    lastCreatedYear: { type: Number, default: -1 },
    lastProcessedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

recurringExpenseSchema.index({ user: 1, active: 1, dayOfMonth: 1 });

recurringExpenseSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

recurringExpenseSchema.set("toJSON", { virtuals: true });
recurringExpenseSchema.set("toObject", { virtuals: true });

const RecurringExpense = model("RecurringExpense", recurringExpenseSchema);
export default RecurringExpense;
