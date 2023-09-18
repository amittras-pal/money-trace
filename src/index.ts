import cors from "cors";
import express, { Application, json, urlencoded } from "express";
import errorHandler from "./middlewares/error.middleware";
import budgetRoutes from "./routes/budget.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import expensePlanRoutes from "./routes/expensePlan.routes";
import reportingRoutes from "./routes/reporting.routes";
import userRoutes from "./routes/user.routes";

const app: Application = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense-plan", expensePlanRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportingRoutes);

app.get("*", (_req, res) => {
  res.redirect("https://expensary.web.app");
});

app.use(errorHandler);

export default app;
