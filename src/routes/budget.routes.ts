import { Router } from "express";
import {
  createBudget,
  getBudget,
  getBudgetsList,
} from "../controllers/budget.controller";
import authenticate from "../middlewares/auth.middleware";

const budgetRoutes = Router();
budgetRoutes
  .route("/")
  .get(authenticate, getBudget)
  .post(authenticate, createBudget);

budgetRoutes.route("/list").post(authenticate, getBudgetsList);

export default budgetRoutes;
