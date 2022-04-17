import endpoints from "../constants/apiEndpoints";
import axios from "./config";

export function getExpenseByCategories(month, year) {
  return axios.get(endpoints.EXPENSE_BY_CATEGORY, { params: { month, year } });
}
