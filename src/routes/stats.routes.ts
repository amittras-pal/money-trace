import { Router } from "express";
import { yearStats } from "../controllers/stats.controller";
import authenticate from "../middlewares/auth.middleware";

const statsRoutes = Router();

statsRoutes.get("/year-stats", authenticate, yearStats);

export default statsRoutes;
