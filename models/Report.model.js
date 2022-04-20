const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Report name is required."],
    triem: true,
  },
  description: {
    type: String,
    required: [true, "Report description is required."],
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
});

module.exports = mongoose.model("Report", reportSchema);
