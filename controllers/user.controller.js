const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");
const http = require("../constants/http");
const jwt = require("jsonwebtoken");

/**
 * @description to register a new user
 * @method POST /api/user/sign-up
 * @access public
 */
const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please add all required fields.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(http.CONFLICT);
    throw new Error(
      "Email is already registered. Please use a different Email ID or login instead."
    );
  }

  const hashSalt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, hashSalt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(http.CREATED).json({
      message:
        "You are succesfully registered, please login using your new credentials.",
      response: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(http.INTERNAL_SERVER_ERROR);
    throw new Error("Something Went Wrong.");
  }
});

/**
 * @description login as a registered user
 * @method POST /api/user/login
 * @access public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please provide all required fields.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(http.NOT_FOUND);
    throw new Error("Email is not registered, please register.");
  } else if (await bcrypt.compare(password, user.password)) {
    res.json({
      message: `Login Successful! Welcome ${user.name}`,
      response: {
        // TODO: Remove user info from the login response.
        userDetails: {
          _id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "48h",
        }),
      },
    });
  } else {
    res.status(http.UNAUTHORIZED);
    throw new Error("Incorrect Username/Password");
  }
});

/**
 * @description get user details
 * @method GET /api/user/
 * @access private
 */
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId, "-password -__v");
  if (user) {
    res.json({ message: "User details retrieved", response: user });
  }
});

/**
 * @description Update user Details
 * @method PUT /api/user/update
 * @access private
 */
const updateUserDetails = asyncHandler(async (req, res) => {
  const { userId, body } = req;
  const updated = await User.findByIdAndUpdate(userId, body, {
    new: true,
  });
  return res.json({
    message: "Updated successfully",
    response: updated,
  });
});

/**
 * @description change password
 * @method POST /api/user/change-password
 * @access private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    res.status(http.BAD_REQUEST);
    throw new Error("Please provide all required fields.");
  }

  const user = await User.findById(req.userId);
  if (await bcrypt.compare(password, user.password)) {
    const hashSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, hashSalt);
    const updated = await User.updateOne(
      { _id: req.userId },
      { password: hashedPassword }
    );

    if (updated) {
      return res.json({
        message: "Your password has been changed successfully.",
        response: { logout: true },
      });
    } else {
      res.status(http.INTERNAL_SERVER_ERROR);
      throw new Error("Something went wrong!");
    }
  } else {
    res.status(http.UNAUTHORIZED);
    throw new Error("Invalid Credentials.");
  }
});

module.exports = {
  signUpUser,
  loginUser,
  getUserDetails,
  updatePassword,
  updateUserDetails,
};
