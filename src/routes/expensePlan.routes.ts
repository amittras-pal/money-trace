import { Router } from "express";
import {
  copyExpensesToBudget,
  createExpensePlan,
  deletePlan,
  getExpensePlans,
  getPlanDetails,
  updatePlan,
} from "../controllers/expensePlan.controller";
import authenticate from "../middlewares/auth.middleware";

const expensePlanRoutes = Router();

expensePlanRoutes
  .route("/")
  .post(authenticate, createExpensePlan)
  .get(authenticate, getExpensePlans)
  .put(authenticate, updatePlan)
  .delete(authenticate, deletePlan);

expensePlanRoutes.get("/details", authenticate, getPlanDetails);
expensePlanRoutes.post("/copy-to-budget", authenticate, copyExpensesToBudget);

export default expensePlanRoutes;
