import { Router } from "express";
import {
  getChangelog,
  getContributor,
  updateUsersOnNewRelease,
} from "../controllers/app-info.controller";
import { systemGate } from "../middlewares/auth.middleware";

const appInfoRouter = Router();

appInfoRouter.get("/changelog", getChangelog);
appInfoRouter.get("/contributor", getContributor);
appInfoRouter.post("/new-release", systemGate, updateUsersOnNewRelease);

export default appInfoRouter;
