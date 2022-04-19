import { useQuery } from "react-query";
import {
  getExpenseBreakdown,
  getExpenseByCategories,
  getLast2DaysExpense,
} from "../api/expense.api";

export function useExpenseSummary(month, year, options) {
  return useQuery(
    ["expense-summary", month, year],
    () => getExpenseByCategories(month, year),
    options
  );
}

export function useExpenseBreakdown(month, year, options) {
  return useQuery(
    ["expense-breakdown", month, year],
    () => getExpenseBreakdown(month, year),
    options
  );
}

export function useLast2DaysExpenses(options) {
  return useQuery("last-two-days", getLast2DaysExpense, options);
}
