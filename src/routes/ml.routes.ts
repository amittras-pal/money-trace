import express from "express";
import { predictCategory } from "../controllers/ml.controller";

const router = express.Router();

router.post("/categorise-expense", predictCategory);

export default router;
