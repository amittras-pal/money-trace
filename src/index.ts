import cors from "cors";
import express, { Application, json, urlencoded } from "express";
import { getEnv } from "./env/config";
import errorHandler from "./middlewares/error.middleware";
import budgetRoutes from "./routes/budget.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import expensePlanRoutes from "./routes/expensePlan.routes";
import reportingRoutes from "./routes/reporting.routes";
import userRoutes from "./routes/user.routes";

const app: Application = express();
const { ORIGINS } = getEnv();

app.use(cors({ origin: ORIGINS }));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense-plan", expensePlanRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportingRoutes);

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
