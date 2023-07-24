import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../config/axios";
import { ENDPOINTS } from "../constants/endpoints";

function getUserData() {
  return axios.get(ENDPOINTS.userInfo);
}

function updateUserDetails(payload) {
  return axios.put(ENDPOINTS.updateUser, payload);
}

/**
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export function useUserData(options) {
  return useQuery(["user"], getUserData, options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 * @returns
 */
export function useUpdateUser(options) {
  return useMutation(updateUserDetails, options);
}
