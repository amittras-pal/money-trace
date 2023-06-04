import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

function getBudget(params) {
  return axios.get(ENDPOINTS.budget, {
    params: {
      month: params.month,
      year: params.year,
    },
  });
}

function createBudget(payload) {
  return axios.post(ENDPOINTS.budget, payload);
}

/**
 *
 * @param {Object} payload
 * @param {number | string} payload.month
 * @param {number | string} payload.year
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export function useBudget(payload, options) {
  return useQuery(["budget", payload], () => getBudget(payload), options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useCreateBudget(options) {
  return useMutation(createBudget, options);
}
