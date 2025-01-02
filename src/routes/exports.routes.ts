import { Router } from "express";
import { generateReport } from "../controllers/exports.controller";
import authenticate from "../middlewares/auth.middleware";

const exportsRoutes = Router();

exportsRoutes.get("/", authenticate, generateReport);

export default exportsRoutes;
