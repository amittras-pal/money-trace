const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Budget = require("../models/Budget.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * @description get budget for a specific month by a user.
 * @method GET /api/budget
 * @access private
 */
const getBudgetForMonth = asyncHandler(async (req, res) => {
  const {
    userId,
    query: { month, year },
  } = req;

  try {
    const budget = await Budget.findOne({
      user: ObjectId(userId),
      month,
      year,
    });
    if (!budget) {
      return res.status(http.NOT_FOUND).json({
        message: "Budget not found for the requested month",
        response: null,
      });
    }
    return res.json({ message: "Budget retrieved", response: budget });
  } catch (error) {
    console.log(error);
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error("Something went wrong.");
  }
});

/**
 * @description get budget for a specific month by a user.
 * @method POST /api/budget
 * @access private
 */
const createBudget = asyncHandler(async (req, res) => {
  const {
    userId,
    body: { month, year, amount },
  } = req;

  try {
    await Budget.create({ month, year, amount, user: userId });
    res
      .status(http.CREATED)
      .json({ message: "Budget created successfully", response: amount });
  } catch (error) {
    console.log(error);
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error("Something went wrong.");
  }
});

module.exports = { getBudgetForMonth, createBudget };
