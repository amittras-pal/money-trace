const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  getExpensesByCategory,
  getAllExpenses,
  getLastTwoDays,
  addExpense,
  editExpense,
  deleteExpense,
  getExpensesForReport,
} = require("../controllers/expense.controller");

router.get("/categories", authenticate, getExpensesByCategory);
router.get("/full", authenticate, getAllExpenses);
router.get("/last-two-days", authenticate, getLastTwoDays);
router.get("/for-report", authenticate, getExpensesForReport);
router
  .route("/")
  .post(authenticate, addExpense)
  .put(authenticate, editExpense)
  .delete(authenticate, deleteExpense);

module.exports = router;
