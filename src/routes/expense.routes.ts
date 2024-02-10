import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getMonthSummary,
  listExpenses,
  searchExpense,
  updateExpense,
} from "../controllers/expense.controller";
import authenticate from "../middlewares/auth.middleware";

const expenseRoutes = Router();

expenseRoutes.get("/summary", authenticate, getMonthSummary);
expenseRoutes.post("/search", authenticate, searchExpense);
expenseRoutes.post("/list", authenticate, listExpenses);
expenseRoutes
  .route("/")
  .post(authenticate, createExpense)
  .put(authenticate, updateExpense)
  .delete(authenticate, deleteExpense);

export default expenseRoutes;
