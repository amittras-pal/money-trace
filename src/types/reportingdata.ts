import { IBudget } from "./budget";
import { ICategory } from "./category";
import { IExpense } from "./expense";

export type ReportedExpense = Pick<
  IExpense,
  "title" | "description" | "amount" | "date"
> & {
  category: {
    label: String | undefined;
    group: String | undefined;
    color: String | undefined;
  };
  categoryId: String | undefined;
};

export type IExpenseByMonth = {
  _id: string | undefined;
  total: number;
  budget: number;
  expenses: ReportedExpense[];
  categories?: ICategory[];
};

export type IExportingBudget = Pick<IBudget, "amount"> & { _id: String };
