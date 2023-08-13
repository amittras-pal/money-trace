import { Router } from "express";
import { createBudget, getBudget } from "../controllers/budget.controller";
import authenticate from "../middlewares/auth.middleware";

const budgetRoutes = Router();
budgetRoutes
  .route("/")
  .get(authenticate, getBudget)
  .post(authenticate, createBudget);

export default budgetRoutes;
