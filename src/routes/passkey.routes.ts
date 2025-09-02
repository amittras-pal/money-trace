import { Router } from "express";
import { initializePasskeyRegistration } from "../controllers/passkey.controller";
import authenticate from "../middlewares/auth.middleware";

const passkeyRoutes = Router();

passkeyRoutes.get("/init", authenticate, initializePasskeyRegistration);

export default passkeyRoutes;
