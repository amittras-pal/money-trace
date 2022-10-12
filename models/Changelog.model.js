const mongoose = require("mongoose");

const changelogSchema = mongoose.Schema(
  {
    version: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Changelog", changelogSchema);
