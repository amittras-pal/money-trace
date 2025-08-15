import { Router } from "express";
import {
  changePassword,
  getUserDetails,
  login,
  logout,
  register,
  updateUserDetails,
} from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/details", authenticate, getUserDetails);
userRoutes.put("/update", authenticate, updateUserDetails);
userRoutes.post("/update-login-key", authenticate, changePassword);
userRoutes.post("/logout", logout);

export default userRoutes;
