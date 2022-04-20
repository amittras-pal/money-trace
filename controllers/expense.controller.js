const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Expense = require("../models/Expense.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * @description get expenses grouped by category for a given month in a year
 * @method GET /api/expenses/categories?month=<Number[1:12]>&?year=<Number>
 * @access private
 */
const getExpensesByCategory = asyncHandler(async (req, res) => {
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

  const created = await Expense.create({
    title,
    description,
    category,
    amount,
    user,
    report,
  });

  if (created)
    res.status(http.CREATED).json({ message: "Expense created successfully." });
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

  const updated = await Expense.findByIdAndUpdate(_id, {
    title,
    description,
    amount,
    category,
    report,
  });

  if (updated) res.json({ message: "Expense record updated successfully." });
});

/**
 * @description delete expense
 * @method DELETE /api/expenses/
 * @access private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.query;
  const deleted = await Expense.findByIdAndDelete(expenseId);
  if (deleted) res.json({ message: "Expense record deleted successfylly." });
});

/**
 * @description get expenses for a report
 * @method GET /api/expenses/for-report
 * @access private
 */
const getExpensesForReport = asyncHandler(async (req, res) => {
  const {
    userId,
    query: { reportId },
  } = req;
  try {
    const expenses = await Expense.find(
      {
        user: ObjectId(userId),
        report: ObjectId(reportId),
      },
      { __v: 0, user: 0, report: 0 }
    );
    res.json({
      message: "Expenses for report is retrieved",
      response: expenses,
    });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

module.exports = {
  getExpensesByCategory,
  getAllExpenses,
  getLastTwoDays,
  addExpense,
  editExpense,
  deleteExpense,
  getExpensesForReport,
};
