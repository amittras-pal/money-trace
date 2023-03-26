import { useMutation } from "@tanstack/react-query";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

function login(payload) {
  return axios.post(ENDPOINTS.login, payload);
}

function register(payload) {
  return axios.post(ENDPOINTS.register, payload);
}

/**
 * Login User
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useLoginUser(options) {
  return useMutation(login, options);
}

/**
 * Login User
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useRegisterUser(options) {
  return useMutation(register, options);
}
