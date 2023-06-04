import { Router } from "express";
import {
  getUserDetails,
  login,
  register,
} from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/details", authenticate, getUserDetails);
// TODO: userRoutes.put("/update", authenticate, update);
// TODO: userRoutes.delete("/update", authenticate, delete);

export default userRoutes;
