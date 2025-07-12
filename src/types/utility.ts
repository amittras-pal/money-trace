import { ICategory } from "./category";
import { IExpense } from "./expense";
import { TypedRequest } from "./requests";

export type ISearchReqBody = {
  q?: string;
  startDate?: string;
  endDate?: string;
  sort?: Record<string, 1 | -1>;
  categories?: string[];
};

export type IListReqBody = {
  startDate: string | undefined;
  endDate: string | undefined;
  plan: string | undefined;
  sort: Record<string, 1 | -1>;
};

export type ISummaryReqParams = {
  startDate: string | undefined;
  endDate: string | undefined;
  plan: string | undefined;
};

export type IReportRequest = {
  startDate: string;
  endDate: string;
  includeList: string;
};

export type PlanExportRequest = TypedRequest<{ plan: string }>;
export type PlanExportContent = Pick<
  IExpense,
  "_id" | "amount" | "date" | "description" | "linked" | "title"
> & {
  category: Pick<ICategory, "color" | "group" | "label">;
};

export type YearTrendRequest = TypedRequest<{ year: string }>;

export type MonthTrendRequest = TypedRequest<{ year: string; month: string }>;
