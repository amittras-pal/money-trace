const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const http = require("../constants/http");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(http.UNAUTHORIZED);
      throw new Error(error.message);
    }
  } else {
    res.status(http.UNAUTHORIZED);
    throw new Error("Unauthorized, No Token.");
  }
});

module.exports = authenticate;
