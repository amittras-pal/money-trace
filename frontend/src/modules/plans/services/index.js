import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

function createPlan(payload) {
  return axios.post(ENDPOINTS.plans, payload);
}

function updatePlan(payload) {
  console.log(payload);
  return axios.put(ENDPOINTS.plans, payload);
}

function getPlans(open) {
  return axios.get(ENDPOINTS.plans, { params: { open } });
}

function getPlanDetails(_id) {
  return axios.get(ENDPOINTS.planDetails, { params: { _id } });
}

function deletePlan(_id) {
  return axios.delete(ENDPOINTS.plans, { params: { _id } });
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useCreatePlan(options) {
  return useMutation(createPlan, options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useUpdatePlan(options) {
  return useMutation(updatePlan, options);
}

/**
 *
 * @param {boolean} open
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export function useExpensePlans(open, options) {
  return useQuery(["plans-list", open], () => getPlans(open), options);
}

/**
 *
 * @param {Object} data
 * @param {string[]} expenses
 */
function copyExpensesToBudget(data) {
  return axios.post(ENDPOINTS.copyExpenses, data);
}

/**
 *
 * @param {string} _id
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export function usePlanDetails(_id, options) {
  return useQuery(["plan-details", _id], () => getPlanDetails(_id), options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useDeletePlan(options) {
  return useMutation(deletePlan, options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useCopyToBudget(options) {
  return useMutation(copyExpensesToBudget, options);
}
