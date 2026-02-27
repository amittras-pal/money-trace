import { Router } from "express";
import {
  createRecurringExpense,
  deleteRecurringExpense,
  listRecurringExpenses,
  processDueForAllUsers,
  processDueForUser,
  updateRecurringExpense,
} from "../controllers/recurringExpense.controller";
import authenticate, { systemGate } from "../middlewares/auth.middleware";

const recurringExpenseRoutes = Router();

// CRUD – all protected by authenticate
recurringExpenseRoutes.get("/", authenticate, listRecurringExpenses);
recurringExpenseRoutes
  .route("/")
  .post(authenticate, createRecurringExpense)
  .put(authenticate, updateRecurringExpense)
  .delete(authenticate, deleteRecurringExpense);

// Processing – user-scoped (authenticate)
recurringExpenseRoutes.post("/process", authenticate, processDueForUser);

// Processing – global (systemGate, for external cron / admin)
recurringExpenseRoutes.post("/process-all", systemGate, processDueForAllUsers);

export default recurringExpenseRoutes;
