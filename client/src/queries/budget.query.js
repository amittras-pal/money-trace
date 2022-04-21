import { useMutation, useQuery } from "react-query";
import { addBudget, getBudget } from "../api/budget.api";

export function useAddBudget(options) {
  return useMutation(addBudget, options);
}

export function useBudget(month, year, options) {
  return useQuery(
    ["budget-data", month, year],
    () => getBudget(month, year),
    options
  );
}
