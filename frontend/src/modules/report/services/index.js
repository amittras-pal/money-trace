import { useMutation } from "@tanstack/react-query";
import axios from "../../../config/axios";
import { ENDPOINTS } from "../../../constants/endpoints";

/**
 *
 * @param {Object} params
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @returns
 */
function downloadReport(params) {
  return axios.get(ENDPOINTS.downloadReport, { params, responseType: "blob" });
}

/**
 *
 * @param {import("@tanstack/react-query").UseMutationOptions} options
 */
export function useDownloadReport(options) {
  return useMutation(downloadReport, options);
}
