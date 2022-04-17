import { useQuery } from "react-query";
import { getExpenseByCategories } from "../api/expense.api";

export function useExpenseByCategories(month, year, options) {
  return useQuery(
    ["category-expences", month, year],
    () => getExpenseByCategories(month, year),
    options
  );
}
