import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Borders, Color, Column, Fill, Font, RichText } from "exceljs";
import { groupBy, pick } from "lodash";
import { IExpenseByMonth, ReportedExpense } from "../types/reportingdata";
import { IReportRequest } from "../types/utility";
import { colorMap } from "./colormap";

// Extend Dayzs for sone calculations.
dayjs.extend(utc);
dayjs.extend(timezone);

// Column Structure for Data Items
export const currencyFormat = `"₹ "#,##0.00`;
export const percentageFormat = `#,#0.00"%"`;
export const dataColumns: Partial<Column>[] = [
  {
    header: "Expense Title",
    key: "title",
    width: 40,
    style: { alignment: { vertical: "top" } },
  },
  { header: "Expense Description", key: "description", width: 80 },
  {
    header: "Amount",
    key: "amount",
    width: 20,
    style: { numFmt: currencyFormat, alignment: { vertical: "top" } },
  },
  {
    header: "Category",
    key: "categoryName",
    width: 20,
    style: { alignment: { vertical: "top" } },
  },
  {
    header: "Sub Category",
    key: "subCategoryName",
    width: 20,
    style: { alignment: { vertical: "top" } },
  },
  {
    header: "Date",
    key: "date",
    width: 20,
    style: { alignment: { vertical: "top" } },
  },
];

// Column Structure for Summary
// respecting previously built column widths.
export const summaryColumns: Partial<Column>[] = [
  {
    header: "Set Budget",
    key: "budget",
    width: 40,
    style: { numFmt: currencyFormat },
  },
  {
    header: "Amount Spent",
    key: "total",
    width: 80,
    style: { numFmt: currencyFormat },
  },
  {
    header: "%",
    key: "percentage",
    width: 20,
    style: { numFmt: percentageFormat },
  },
  { width: 20 },
  { width: 20 },
  { width: 20 },
];

export const contentTypeXLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Styling for the headers.
export const headerBorder: Partial<Borders> = {
  bottom: { style: "thick", color: getColor("dark", 6) },
  right: { style: "thin", color: getColor("dark", 6) },
  left: { style: "thin", color: getColor("dark", 6) },
  top: { style: "thin", color: getColor("dark", 6) },
};
export const headerBg: Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: getColor("gray", 3),
};

// Border Styling for data row.
export const dataRowBorder: Partial<Borders> = {
  bottom: { style: "thin", color: getColor("dark", 6) },
  right: { style: "thin", color: getColor("dark", 6) },
  left: { style: "thin", color: getColor("dark", 6) },
  top: { style: "thin", color: getColor("dark", 6) },
};

// Expense based coloring for data rows.
export function getDataFill(color: string): Fill {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: getColor(color, 1),
  };
}

export function getDataFont(color: string, bold: boolean): Partial<Font> {
  return { color: getColor(color, 8), bold };
}

// format datetime in user time zone.
export function getZonedTime(
  user: any,
  date: string | Date,
  includeTime?: boolean
) {
  return dayjs(date)
    .tz(user.timeZone)
    .format(includeTime ? "DD-MM, hh:mm a" : "DD MMM");
}

// determine whether the selected range of dates includes the beginning and ending of the month.
// Provide notice if report is generated for incompolete month.
function getRangeCaps(
  user: any,
  month: IExpenseByMonth,
  startDate: string,
  endDate: string
) {
  const beginningMismatch =
    dayjs(month._id).tz(user.timeZone).month() ===
      dayjs(startDate).tz(user.timeZone).month() &&
    dayjs(startDate).tz(user.timeZone).date() !== 1;
  const endingMismatch =
    dayjs(month._id).tz(user.timeZone).month() ===
      dayjs(endDate).tz(user.timeZone).month() &&
    dayjs(endDate).tz(user.timeZone).date() !==
      dayjs(endDate).tz(user.timeZone).daysInMonth();

  return { beginningMismatch, endingMismatch };
}

// Get a warning RTF formatted message if either end of a range is not covering the entire month.
export function getIncompleteNotice(
  user: any,
  req: IReportRequest,
  month: IExpenseByMonth
): RichText[] {
  const cap = getRangeCaps(user, month, req.startDate, req.endDate);
  if (!cap.beginningMismatch && !cap.endingMismatch) return [];

  const noticeColor = getColor("red", 8);
  const notice: RichText[] = [];
  notice.push({
    text: "Summary Incomplete: ",
    font: { bold: true, color: noticeColor },
  });

  // beginning is not the start of month
  if (cap.beginningMismatch)
    notice.push(
      { text: "Starts On: ", font: { bold: true } },
      {
        text: getZonedTime(user, req.startDate),
        font: { bold: true, color: noticeColor },
      }
    );
  // separator if both start and end are not the month extremes
  if (cap.beginningMismatch && cap.endingMismatch)
    notice.push({ text: "  ||  ", font: { bold: true } });

  // ending is not the end of month
  if (cap.endingMismatch)
    notice.push(
      { text: "Ends On: ", font: { bold: true } },
      {
        text: getZonedTime(user, req.endDate),
        font: { bold: true, color: noticeColor },
      }
    );

  return notice;
}

// Merges budget info into the expenses list
export function mergeBudgetsInExpense(expensesData: any, budgetsData: any) {
  const data: IExpenseByMonth[] = expensesData.map((month: any) => {
    const budget = budgetsData.find((b: any) => b._id === month._id)?.amount;
    return {
      _id: month._id,
      budget,
      total: month.total,
      percentage: getPercentage(month.total, budget),
      expenses: month.expenses.map((e: ReportedExpense) => {
        return pick({ ...e, category: getCategory(month, e) }, [
          "title",
          "description",
          "date",
          "amount",
          "category",
          "linked",
        ]);
      }),
    };
  });

  return data;
}

// Get color for a range of values between 0-100
export function getSeverityColor(amount: number, budget: number) {
  const perc = getPercentage(amount, budget);
  if (perc <= 45) return "green";
  else if (perc > 45 && perc <= 70) return "yellow";
  else if (perc > 70 && perc <= 90) return "orange";
  else return "red";
}

// Generate color code
export function getColor(color: string, shade: number): Partial<Color> {
  return { argb: colorMap[color][shade] };
}

// Calculate percentage
function getPercentage(amount: number, budget: number): number {
  return (amount / budget) * 100;
}

// Extract category info for an expense
function getCategory(month: any, ex: ReportedExpense) {
  const category = month.categories?.find(
    (cat: any) => cat._id?.toString() === ex.categoryId?.toString()
  );
  return pick(category, ["label", "color", "group"]);
}

export function generateSummary(expenses: ReportedExpense[]) {
  const byCategory = groupBy(expenses, "category.group");
  return Object.entries(byCategory).map(([group, list]) => {
    return {
      group,
      bySubCategory: groupBy(list, "category.label"),
      list,
      total: getTotalAmount(list),
      color: list[0].category.color,
    };
  });
}

export function getTotalAmount(list: ReportedExpense[]): number {
  return list.reduce((sum, curr) => sum + curr.amount, 0);
}
