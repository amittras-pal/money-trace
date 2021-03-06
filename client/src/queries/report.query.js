import { useMutation, useQuery } from "react-query";
import {
  createReport,
  deleteReport,
  editReport,
  getReportDetails,
  getReports,
} from "../api/reports.api";

export function useReports(all, options) {
  return useQuery(["reports", all], () => getReports(all), options);
}

export function useEditReport(options) {
  return useMutation(editReport, options);
}

export function useCreateReport(options) {
  return useMutation(createReport, options);
}

export function useDeleteReport(options) {
  return useMutation(deleteReport, options);
}

export function useReportDetails(reportId, options) {
  return useQuery(
    ["report-details", reportId],
    () => getReportDetails(reportId),
    options
  );
}
