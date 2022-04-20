import endpoints from "../constants/apiEndpoints";
import axios from "./config";

export function getExpenseByCategories(month, year) {
  return axios.get(endpoints.EXPENSE_BY_CATEGORY, { params: { month, year } });
}

export function getExpenseBreakdown(month, year) {
  return axios.get(endpoints.EXPENSE_BREAKDOWN, { params: { month, year } });
}

export function getLast2DaysExpense() {
  return axios.get(endpoints.EXPENSE_LAST_2_DAYS);
}

export function addExpense(formData) {
  return axios.post(endpoints.EXPENSE_ADD_EDIT_DELETE, formData);
}

export function editExpense(formData) {
  return axios.put(endpoints.EXPENSE_ADD_EDIT_DELETE, formData);
}

export function deleteExpense(expenseId) {
  return axios.delete(endpoints.EXPENSE_ADD_EDIT_DELETE, {
    params: { expenseId },
  });
}

export function getExpensesForReport(reportId) {
  return axios.get(endpoints.EXPENSE_FOR_REPORT, { params: { reportId } });
}
