import { Router } from "express";
import {
  changePassword,
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
userRoutes.post("/change-password", authenticate, changePassword);

export default userRoutes;
