import { Router } from "express";
import { generateReport } from "../controllers/reporting.controller";
import authenticate from "../middlewares/auth.middleware";

const reportingRoutes = Router();

reportingRoutes.get("/", authenticate, generateReport);

export default reportingRoutes;
