import { Router } from "express";
import {
  exportPlan,
  exportRangeReport,
} from "../controllers/exports.controller";
import authenticate from "../middlewares/auth.middleware";

const exportsRoutes = Router();

exportsRoutes
  .get("/range", authenticate, exportRangeReport)
  .get("/plan", authenticate, exportPlan);

export default exportsRoutes;
