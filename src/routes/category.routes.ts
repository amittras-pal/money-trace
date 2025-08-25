import { Router } from "express";
import {
  getCategories,
  getCategoryGroups,
} from "../controllers/category.controller";
import authenticate from "../middlewares/auth.middleware";

const categoryRoutes = Router();

categoryRoutes
  .get("/get-all", authenticate, getCategories)
  .get("/get-groups", authenticate, getCategoryGroups);

export default categoryRoutes;
