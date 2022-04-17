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
    { $match: { user: ObjectId(userId) } },
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
    { $match: { user: ObjectId(userId) } },
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

module.exports = { getExpensesByCategory, getAllExpenses };
