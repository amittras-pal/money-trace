import { Router } from "express";
import {
  monthStats,
  rollingStats,
} from "../controllers/stats.controller";
import authenticate from "../middlewares/auth.middleware";

const statsRoutes = Router();

statsRoutes
  .get("/rolling-stats", authenticate, rollingStats)
  .get("/month-stats", authenticate, monthStats);

export default statsRoutes;
