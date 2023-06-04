import { model, Schema } from "mongoose";
import { IBudget } from "../types/budget";

const budgetSchema = new Schema<IBudget>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  month: {
    type: Number,
    required: [true, "Please add month"],
    min: 0,
    max: 11,
  },
  year: { type: Number, required: [true, "Please add the year"] },
  amount: { type: Number, required: true },
});

const Budget = model("Budget", budgetSchema);

export default Budget;
