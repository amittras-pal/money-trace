import endpoints from "../constants/apiEndpoints";
import axios from "./config";

export function loginUser(formData) {
  return axios.post(endpoints.LOGIN, formData);
}

export function signUp(formData) {
  return axios.post(endpoints.SIGN_UP, formData);
}

export function getUserDetails() {
  return axios.get(endpoints.USER_DETAILS);
}

export function updateUser(formData) {
  return axios.put(endpoints.UPDATE_USER, formData);
}
