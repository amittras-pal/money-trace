import { Router } from "express";
import { getCategories } from "../controllers/category.controller";
import authenticate from "../middlewares/auth.middleware";

const categoryRoutes = Router();

categoryRoutes.get("/get-all", authenticate, getCategories);

export default categoryRoutes;
