const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  amount: {
    type: Number,
    required: [true, "Please enter an amount"],
  },
  month: {
    type: Number,
    required: [true, "Please add month"],
    min: 1,
    max: 12,
  },
  year: { type: Number, required: [true, "Please add the year"] },
});

module.exports = mongoose.model("Budget", budgetSchema);
