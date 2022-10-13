import endpoints from "../constants/endpoints";
import axios from "../config/axios.config";

export function getMonthSummary(month, year) {
  return axios.get(endpoints.MONTH_SUMMARY, { params: { month, year } });
}

export function getExpenseBreakdown(month, year) {
  return axios.get(endpoints.EXPENSE_BREAKDOWN, { params: { month, year } });
}

export function getLast2DaysExpense() {
  return axios.get(endpoints.EXPENSE_LAST_2_DAYS);
}

export function addExpense(formData) {
  return axios.post(endpoints.EXPENSE_ALL_ACTIONS, formData);
}

export function editExpense(formData) {
  return axios.put(endpoints.EXPENSE_ALL_ACTIONS, formData);
}

export function deleteExpense(expenseId) {
  return axios.delete(endpoints.EXPENSE_ALL_ACTIONS, {
    params: { expenseId },
  });
}

export function revertExpense({ expenseId, revertMsg }) {
  return axios.patch(
    endpoints.EXPENSE_ALL_ACTIONS,
    { revertMsg },
    { params: { expenseId } }
  );
}
