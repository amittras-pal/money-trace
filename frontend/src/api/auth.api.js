import endpoints from "../constants/endpoints";
import axios from "../config/axios.config";

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

export function changePassword(formData) {
  return axios.put(endpoints.CHANGE_PASSWORD, formData);
}
