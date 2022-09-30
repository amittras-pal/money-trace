const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Expense = require("../models/Expense.model");
const Report = require("../models/Report.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * @description get expenses grouped by category for a given month in a year
 * @method GET /api/expenses/categories?month=<Number[1:12]>&?year=<Number>
 * @access private
 */
const getMonthSummary = asyncHandler(async (req, res) => {
  const {
    userId,
    query: { month, year },
  } = req;
  const expenses = await Expense.aggregate([
    { $match: { user: ObjectId(userId), report: null, reverted: false } },
    {
      $addFields: {
        month: { $month: "$expenseDate" },
        year: { $year: "$expenseDate" },
      },
    },
    { $match: { month: Number(month), year: Number(year) } },
    {
      $group: {
        _id: { category: "$category" },
        amounts: { $push: "$amount" },
      },
    },
    {
      $addFields: {
        name: "$_id.category",
        value: { $sum: "$amounts" },
      },
    },
    {
      $project: {
        amounts: 0,
        _id: 0,
      },
    },
    { $sort: { name: 1 } },
  ]);
  return res.json({
    message: "Expenses retrieved",
    response: {
      categories: expenses,
      total: expenses.reduce((prev, curr) => prev + curr.value, 0),
    },
  });
});

/**
 * @description get full expense details for a given month in a year
 * @method GET /api/expenses/full?month=<Number[1:12]>&?year=<Number>
 * @access private
 */
const getAllExpenses = asyncHandler(async (req, res) => {
  const {
    userId,
    query: { month, year },
  } = req;
  const expenses = await Expense.aggregate([
    { $match: { user: ObjectId(userId), report: null } },
    {
      $addFields: {
        month: { $month: "$expenseDate" },
        year: { $year: "$expenseDate" },
      },
    },
    { $match: { month: Number(month), year: Number(year) } },
    {
      $project: {
        __v: 0,
        month: 0,
        year: 0,
        user: 0,
      },
    },
  ]);
  return res.json({
    message: "Expenses retrieved",
    response: expenses,
  });
});

/**
 * @description get full expense details for last 2 days
 * @method GET /api/expenses/last-two-days
 * @access private
 */
const getLastTwoDays = asyncHandler(async (req, res) => {
  const { userId } = req;
  const startDate = new Date().setDate(new Date().getDate() - 2);
  const expenses = await Expense.find(
    {
      user: ObjectId(userId),
      report: null,
      expenseDate: {
        $gte: startDate,
      },
    },
    { user: 0, __v: 0 },
    { sort: { expenseDate: -1 } }
  );
  return res.json({ message: "Last 2 days expenses", response: expenses });
});

/**
 * @description add expense
 * @method POST /api/expenses/
 * @access private
 */
const addExpense = asyncHandler(async (req, res) => {
  const {
    userId: user,
    body: { title, description, amount, category, report },
  } = req;
  if (!title || !amount || !category) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please provide all amndatory fields.");
  }

  const expenseBody = {
    title,
    description,
    category,
    amount,
    user,
  };
  if (report) expenseBody.report = report;

  try {
    await Expense.create(expenseBody);
    if (report) {
      await Report.findByIdAndUpdate(report, { $inc: { total: amount } });
    }
    res.status(http.CREATED).json({ message: "Expense created successfully." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

/**
 * @description update expense
 * @method PUT /api/expenses/
 * @access private
 */
const editExpense = asyncHandler(async (req, res) => {
  const {
    userId: user,
    body: { _id, title, description, amount, category, report },
  } = req;

  if (!title || !amount || !category) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please provide all amndatory fields.");
  }

  const expensePayload = { title, description, amount, category };
  if (report) expensePayload.report = report;
  else expensePayload.report = null;

  await Expense.findByIdAndUpdate(_id, expensePayload);
  res.json({ message: "Expense record updated successfully." });
});

/**
 * @description delete expense
 * @method DELETE /api/expenses/
 * @access private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.query;
  try {
    await Expense.findByIdAndDelete(expenseId);
    res.json({ message: "Expense record deleted successfylly." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

/**
 * @description revert expense / mark as refunded.
 * This will cause the expense to be in record but will not be considered in total for the budget.
 * @method PATCH
 * @access private
 */
const revertExpense = asyncHandler(async (req, res) => {
  const {
    query: { expenseId },
    body: { revertMsg },
  } = req;

  try {
    const expense = await Expense.findById(expenseId);
    expense.reverted = true;
    expense.title = `Reverted ${expense.title}`;
    expense.description = `[REVERTED ${revertMsg}] ${expense.description}`;
    await expense.save();
    res.json({ message: "Expense reverted successfully." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

module.exports = {
  getMonthSummary,
  getAllExpenses,
  getLastTwoDays,
  addExpense,
  editExpense,
  deleteExpense,
  revertExpense,
};
