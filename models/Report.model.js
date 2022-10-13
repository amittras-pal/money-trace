const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Report name is required."],
      trim: true,
      maxlength: 40,
    },
    description: {
      type: String,
      required: [true, "Report description is required."],
      maxlength: 180,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    open: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
