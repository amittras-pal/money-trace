import cors from "cors";
import express, { Application, json, urlencoded } from "express";
import path from "path";
import errorHandler from "./middlewares/error.middleware";
import budgetRoutes from "./routes/budget.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import expensePlanRoutes from "./routes/expensePlan.routes";
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(errorHandler);

export default app;
