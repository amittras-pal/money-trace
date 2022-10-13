import endpoints from "../constants/endpoints";
import axios from "../config/axios.config";

export function addBudget(formData) {
  return axios.post(endpoints.BUDGET, formData);
}

export function getBudget(month, year) {
  return axios.get(endpoints.BUDGET, { params: { month, year } });
}
