const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Category = require("../models/Category.model");

/**
 * @description get all categories
 * @method GET /api/categories/
 * @access public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    return res.json({
      message: "Categories retrieved",
      response: { categories },
    });
  } else {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error("Something went wrong while retrieving categories.");
  }
});

module.exports = { getCategories };
