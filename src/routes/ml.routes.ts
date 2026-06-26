import express from "express";
import { predictCategory } from "../controllers/ml.controller";
import authenticate from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/categorise-expense", authenticate, predictCategory);

export default router;
