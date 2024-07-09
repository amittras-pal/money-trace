import { Router } from "express";
import { getChangelog } from "../controllers/app-info.controller";

const appInfoRouter = Router();

appInfoRouter.get("/changelog", getChangelog);
// appInfoRouter.get("/contributor", getChangelog);

export default appInfoRouter;
