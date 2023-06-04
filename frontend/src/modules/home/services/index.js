import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

function createExpense(payload) {
  return axios.post(ENDPOINTS.expenses, payload);
}

function editExpense(payload) {
  return axios.put(ENDPOINTS.expenses, payload);
}

function deleteExpense(id) {
  return axios.delete(ENDPOINTS.expenses, { params: { id } });
}

function getSummary(plan = null) {
  return axios.get(ENDPOINTS.summary, {
    params: {
      firstDay: plan ? null : dayjs().startOf("month").toDate(),
      lastDay: plan ? null : dayjs().endOf("month").toDate(),
      plan: plan,
    },
  });
}

function getRecentTransactions() {
  return axios.post(ENDPOINTS.list, {
    startDate: dayjs().subtract(7, "days").toDate(),
    endDate: dayjs().toDate(),
    sort: { date: -1 },
  });
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useCreateExpense(options) {
  return useMutation(createExpense, options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useEditExpense(options) {
  return useMutation(editExpense, options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useDeleteExpense(options) {
  return useMutation(deleteExpense, options);
}

/**
 * @param {string} plan
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 */
export function useSummary(plan, options) {
  return useQuery(["summary", plan], () => getSummary(plan), options);
}

/**
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 */
export function useRecentTransactions(options) {
  return useQuery(["recent-transactions"], getRecentTransactions, options);
}
