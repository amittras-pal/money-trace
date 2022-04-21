const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");

const {
  createBudget,
  getBudgetForMonth,
} = require("../controllers/budget.controller");

router
  .route("/")
  .post(authenticate, createBudget)
  .get(authenticate, getBudgetForMonth);

module.exports = router;
