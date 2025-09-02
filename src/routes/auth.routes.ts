import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  getUserDetails,
  login,
  logout,
  register,
  updateUserDetails,
} from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/details", authenticate, getUserDetails);
authRoutes.put("/update", authenticate, updateUserDetails);
authRoutes.post("/update-login-key", authenticate, changePassword);
authRoutes.post("/logout", logout);
authRoutes.delete("/delete-account", authenticate, deleteAccount);

export default authRoutes;
