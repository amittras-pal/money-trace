import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getMonthSummary,
  listExpenses,
  updateExpense,
} from "../controllers/expense.controller";
import authenticate from "../middlewares/auth.middleware";

const expenseRoutes = Router();

expenseRoutes.get("/summary", authenticate, getMonthSummary);
expenseRoutes.post("/list", authenticate, listExpenses);

expenseRoutes
  .route("/")
  .post(authenticate, createExpense)
  .put(authenticate, updateExpense)
  .delete(authenticate, deleteExpense);

export default expenseRoutes;
