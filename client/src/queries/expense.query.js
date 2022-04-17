import { useQuery } from "react-query";
import {
  getExpenseBreakdown,
  getExpenseByCategories,
} from "../api/expense.api";

export function useExpenseByCategories(month, year, options) {
  return useQuery(
    ["category-expences", month, year],
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
