const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  getExpensesByCategory,
  getAllExpenses,
  getLastTwoDays,
  addExpense,
} = require("../controllers/expense.controller");

router.get("/categories", authenticate, getExpensesByCategory);
router.get("/full", authenticate, getAllExpenses);
router.get("/last-two-days", authenticate, getLastTwoDays);

router.post("/", authenticate, addExpense);

module.exports = router;
