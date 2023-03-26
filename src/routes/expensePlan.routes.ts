import { Router } from "express";
import { createExpensePlan } from "../controllers/expensePlan.controller";
import authenticate from "../middlewares/auth.middleware";

const expensePlanRoutes = Router();
expensePlanRoutes.post("/", authenticate, createExpensePlan);

export default expensePlanRoutes;
