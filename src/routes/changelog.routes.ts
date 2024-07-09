import { Router } from "express";
import { getChangelog } from "../controllers/changelog.controller";

const changeLogRouter = Router();

changeLogRouter.get("/", getChangelog);

export default changeLogRouter;
