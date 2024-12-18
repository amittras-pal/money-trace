import { Router } from "express";
import { monthStats, yearStats } from "../controllers/stats.controller";
import authenticate from "../middlewares/auth.middleware";

const statsRoutes = Router();

statsRoutes
  .get("/year-stats", authenticate, yearStats)
  .get("/month-stats", authenticate, monthStats);

export default statsRoutes;
