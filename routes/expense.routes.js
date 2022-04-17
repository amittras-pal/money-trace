const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");
const {
  getExpensesByCategory,
  getAllExpenses,
} = require("../controllers/expense.controller");

router.get("/categories", authenticate, getExpensesByCategory);
router.get("/full", authenticate, getAllExpenses);

module.exports = router;
