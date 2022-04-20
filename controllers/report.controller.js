const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Report = require("../models/Report.model");
const Expense = require("../models/Expense.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * @description get open Reports created by a user.
 * @method GET /api/reports
 * @access private
 */
const getReports = asyncHandler(async (req, res) => {
  const {
    userId,
    query: { all },
  } = req;
  const query = { user: ObjectId(userId) };
  if (!all) {
    query.open = true;
  }

  try {
    const reports = await Report.find(query, { __v: 0, user: 0 });
    return res.json({
      message: "Reports retrieved successfully.",
      response: reports,
    });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }

  console.log(query);
});

/**
 * @description create a new report
 * @method POST /api/reports
 * @access private
 */
const createReport = asyncHandler(async (req, res) => {
  console.log("I'm here.");
  const {
    userId,
    body: { name, description },
  } = req;
  if (!name || !description) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please provide all mandatory fields.");
  }

  try {
    await Report.create({ name, description, user: userId });
    return res.json({ message: "Reports created successfully." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

/**
 * @description update a report
 * @method PUT /api/reports
 * @access private
 */
const updateReport = asyncHandler(async (req, res) => {
  const { reportId, name, description, open } = req.body;
  try {
    const updated = await Report.findByIdAndUpdate(reportId, {
      name,
      description,
      open,
    });
    res.json({ message: "Changes saved successfully." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

/**
 * @description delete a report
 * @method DELETE /api/reports
 * @access private
 */
const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.query;
  try {
    await Report.findByIdAndDelete(reportId);
    await Expense.deleteMany({ report: ObjectId(reportId) });
    return res.status(http.DELETED).json("Report deleted successfully.");
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error("Something went wrong.");
  }
});

module.exports = { getReports, createReport, updateReport, deleteReport };
