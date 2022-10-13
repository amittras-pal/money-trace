const asyncHandler = require("express-async-handler");
const http = require("../constants/http");
const Changelog = require("../models/Changelog.model");

/**
 * @description create a new changelog
 * @method POST /api/changelog
 * @access private
 */
const createChangelog = asyncHandler(async (req, res) => {
  const { version, content } = req.body;
  if (!version || !content) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please add all required fields.");
  }

  try {
    await Changelog.create({ version, content });
    res.status(http.CREATED).json({ message: "Changelog Created." });
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

/**
 * @description create a new changelog
 * @method GET /api/changelog?version=<version_number>
 * @access private
 */
const getChangelog = asyncHandler(async (req, res) => {
  const { version } = req.query;
  const log = await Changelog.findOne({
    version,
  });
  return res.json({
    message: `What's New in ${version}`,
    response: log,
  });
});

module.exports = {
  createChangelog,
  getChangelog,
};
