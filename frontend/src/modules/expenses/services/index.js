import { useQuery } from "@tanstack/react-query";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

function getExpenseList(payload) {
  return axios.post(ENDPOINTS.list, payload);
}

/**
 *
 * @param {Object} options
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export function useExpenseList(payload, options) {
  return useQuery(["list", payload], () => getExpenseList(payload), options);
}
