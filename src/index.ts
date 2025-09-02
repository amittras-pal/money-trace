import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, json, urlencoded } from "express";

import { getEnv } from "./env/config";

import errorHandler from "./middlewares/error.middleware";
import morganLogger from "./middlewares/logging.middleware";

import authRoutes from "./routes/auth.routes";
import budgetRoutes from "./routes/budget.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import expensePlanRoutes from "./routes/expensePlan.routes";
import exportsRoutes from "./routes/exports.routes";
import passkeyRoutes from "./routes/passkey.routes";
import statsRoutes from "./routes/stats.routes";
import systemRoutes from "./routes/sys-info.routes";

const app: Application = express();
const { ORIGINS } = getEnv();

app.use(cookieParser());
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morganLogger);

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense-plan", expensePlanRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/export", exportsRoutes);
app.use("/api/passkey", passkeyRoutes);
app.use("/api/sys-info", systemRoutes);
app.use("/api/statistics", statsRoutes);

// This is required since server is hosted on an ephemeral container, which takes time to come up;
// This allows the FE to show an animation state and not load the rest of the app until the server is ready.
app.get("/api/wake", (_req, res) => {
  res.json({ message: "Server Ready!" });
});

app.get("*", (_req, res) => {
  if (process.env.NODE_ENV !== "development")
    return res.redirect("https://expensary.web.app");
  else
    return res.json({
      message:
        "This is an API server, please launch the corresponding frontend app.",
    });
});

app.use(errorHandler);

export default app;
