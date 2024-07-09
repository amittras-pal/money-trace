import { Router } from "express";
import {
  getChangelog,
  getContributor,
} from "../controllers/app-info.controller";

const appInfoRouter = Router();

appInfoRouter.get("/changelog", getChangelog);
appInfoRouter.get("/contributor", getContributor);

export default appInfoRouter;
