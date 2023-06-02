import { Router } from "express";
import {
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

export default expensePlanRoutes;
