const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  getAllExpenses,
  getLastTwoDays,
  addExpense,
  editExpense,
  deleteExpense,
  revertExpense,
  getMonthSummary,
} = require("../controllers/expense.controller");

router.get("/month-summary", authenticate, getMonthSummary);
router.get("/full", authenticate, getAllExpenses);
router.get("/last-two-days", authenticate, getLastTwoDays);
router
  .route("/")
  .post(authenticate, addExpense)
  .put(authenticate, editExpense)
  .patch(authenticate, revertExpense)
  .delete(authenticate, deleteExpense);

module.exports = router;
