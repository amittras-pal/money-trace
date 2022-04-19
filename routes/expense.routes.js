const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  getExpensesByCategory,
  getAllExpenses,
  getLastTwoDays,
} = require("../controllers/expense.controller");

router.get("/categories", authenticate, getExpensesByCategory);
router.get("/full", authenticate, getAllExpenses);
router.get("/last-two-days", authenticate, getLastTwoDays);

module.exports = router;
