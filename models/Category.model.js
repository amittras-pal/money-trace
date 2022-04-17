const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description for this category."],
  },
});

module.exports = mongoose.model("Category", categorySchema);
