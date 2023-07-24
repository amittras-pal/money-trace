import { Router } from "express";
import {
  getUserDetails,
  login,
  register,
  updateUserDetails,
} from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/details", authenticate, getUserDetails);
userRoutes.put("/update", authenticate, updateUserDetails);
// TODO: userRoutes.delete("/update", authenticate, delete);

export default userRoutes;
