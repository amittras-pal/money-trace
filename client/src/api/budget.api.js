import endpoints from "../constants/apiEndpoints";
import axios from "./config";

export function addBudget(formData) {
  return axios.post(endpoints.BUDGET, formData);
}

export function getBudget(month, year) {
  return axios.get(endpoints.BUDGET, { params: { month, year } });
}
