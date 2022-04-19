const router = require("express").Router();
const {
  signUpUser,
  loginUser,
  getUserDetails,
  updatePassword,
  updateUserDetails,
} = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/sign-up", signUpUser);
router.post("/login", loginUser);

router.put("/change-password", authenticate, updatePassword);
router.put("/update", authenticate, updateUserDetails);
router.get("/", authenticate, getUserDetails);

module.exports = router;
