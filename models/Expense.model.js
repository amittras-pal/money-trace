const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title for the expense"],
      trim: true,
      maxlength: 40,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 260,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Please add the category name"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    reverted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Expense", expenseSchema);
