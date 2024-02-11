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
  firstDay: string | undefined;
  lastDay: string | undefined;
  plan: string | undefined;
};
