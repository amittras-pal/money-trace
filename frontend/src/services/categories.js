import { useQuery } from "@tanstack/react-query";
import axios from "../config/axios";
import { ENDPOINTS } from "../constants/endpoints";

function getCategories() {
  return axios.get(ENDPOINTS.categories);
}

/** @param {import("@tanstack/react-query").UseQueryOptions} options */
export function useCategories(options) {
  return useQuery(["categories"], getCategories, {
    staleTime: 20 * 60 * 1000,
    ...options,
  });
}
