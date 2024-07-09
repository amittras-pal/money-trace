import { Router } from "express";
import {
  getChangelog,
  getContributor,
  updateUsersOnNewRelease,
} from "../controllers/app-info.controller";

const appInfoRouter = Router();

appInfoRouter.get("/changelog", getChangelog);
appInfoRouter.get("/contributor", getContributor);
appInfoRouter.post("/new-release", updateUsersOnNewRelease);

export default appInfoRouter;
