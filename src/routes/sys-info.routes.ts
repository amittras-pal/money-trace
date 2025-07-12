import { Router } from "express";
import {
  dataBackup,
  getChangelog,
  getContributor,
  updateUsersOnNewRelease,
} from "../controllers/sys-info.controller";
import { systemGate } from "../middlewares/auth.middleware";

const systemRoutes = Router();

systemRoutes.get("/changelog", getChangelog);
systemRoutes.get("/contributor", getContributor);
systemRoutes.post("/new-release", systemGate, updateUsersOnNewRelease);
systemRoutes.post("/backup", systemGate, dataBackup);

export default systemRoutes;
