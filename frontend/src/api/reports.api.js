import endpoints from "../constants/endpoints";
import axios from "../config/axios.config";

export function createReport(formData) {
  return axios.post(endpoints.REPORTS, formData);
}

export function editReport(formData) {
  return axios.put(endpoints.REPORTS, formData);
}

export function deleteReport(reportId) {
  return axios.delete(endpoints.REPORTS, { params: { reportId } });
}

export function getReports(all) {
  const params = {};
  if (all) params.all = 1;
  return axios.get(endpoints.REPORTS, { params });
}

export function getReportDetails(reportId) {
  return axios.get(endpoints.REPORT_DETAILS, { params: { reportId } });
}
