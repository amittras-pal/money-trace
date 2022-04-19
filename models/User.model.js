const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter a name."] },
    email: {
      type: String,
      required: [true, "Please enter an email."],
      unique: [true, "Email is already taken"],
    },
    password: { type: String, required: [true, "Please enter a password."] },
    defaultBudget: {
      type: Number,
      required: [true, "Default monthly budget is required."],
      // default: 25000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
