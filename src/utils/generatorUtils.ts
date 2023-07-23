import dayjs from "dayjs";
import { readFile } from "fs/promises";
import { groupBy, pick } from "lodash";
import { IExpenseByMonth, ReportedExpense } from "../types/reportingdata";

export const dateFormat = "DD MMM 'YY";
export const dateTimeFormat = "DD MMM 'YY @ hh:mm a";
export const dateTimePrecise = "DD MMM 'YY @ hh:mm:ss a";
export const xPos = 25;
export const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

// Adds a notice for an incomplete month, if detected
export function addIncompleteMonthNotice(
  doc: PDFKit.PDFDocument,
  month: IExpenseByMonth,
  startDate: string,
  endDate: string
) {
  const beginningMismatch =
    dayjs(month._id).month() === dayjs(startDate).month() &&
    dayjs(startDate).date() !== 1;
  const endingMismatch =
    dayjs(month._id).month() === dayjs(endDate).month() &&
    dayjs(endDate).date() !== dayjs(endDate).daysInMonth();
  if (beginningMismatch || endingMismatch) {
    doc.fillColor("red", 1).text(`Summary Incomplete || `, { continued: true });
    if (beginningMismatch) {
      doc.text(
        `Starts On: ${dayjs(startDate).date()} ${endingMismatch ? " || " : ""}`,
        {
          continued: endingMismatch,
        }
      );
    }
    if (endingMismatch) {
      doc.text(`Ends On: ${dayjs(endDate).date()}`);
    }
  }
}

// Adds necessary info in the report
export function addReportInfo(
  doc: PDFKit.PDFDocument,
  user: any,
  startDate: string,
  endDate: string
) {
  doc.moveDown(2);
  // User Name
  doc
    .fillColor("black", 0.5)
    .fontSize(16)
    .text("User: ", { continued: true })
    .fillColor("black", 1)
    .text(user.userName);
  // Date Range
  doc
    .fillColor("black", 0.5)
    .fontSize(16)
    .text("Date Range: ", { continued: true })
    .fillColor("black", 1)
    .text(
      `${dayjs(startDate).format(dateFormat)} to ${dayjs(endDate).format(
        dateFormat
      )}`
    );
  // Generation Date
  doc
    .fillColor("black", 0.5)
    .fontSize(16)
    .text("Generated On: ", { continued: true })
    .fillColor("black", 1)
    .text(dayjs().format(dateTimePrecise));
}

// Set document font
// currently using 'Crimson Regular'
export async function setDocumentFont(doc: PDFKit.PDFDocument) {
  const fontFile = await readFile(
    "src/assets/fonts/static/CrimsonPro-Regular.ttf"
  );
  doc.registerFont("Crimson", fontFile);
  doc.font("Crimson");
}

// Add basic metadata to the document
export function addDocumentMeta(doc: PDFKit.PDFDocument, user: any) {
  doc.info["Author"] = "MTrace Web";
  doc.info["CreationDate"] = dayjs().toDate();
  doc.info["Title"] = `${user.userName.replace(" ", "_")}_${dayjs().format(
    "DD_MM_YYYY"
  )}`;
}

// currency format
export function formatCurrency(amount: number | undefined) {
  return amount ? formatter.format(amount) : "";
}

export function getPercentage(amount: number, budget: number): number {
  return (amount / budget) * 100;
}

export function getSeverityColor(amount: number, budget: number) {
  const perc = getPercentage(amount, budget);
  if (perc <= 45) return "green";
  else if (perc > 45 && perc <= 70) return "yellow";
  else if (perc > 70 && perc <= 90) return "orange";
  else return "red";
}

// merges budget info into the expenses list
export function mergeBudgetsInExpense(expensesData: any, budgetsData: any) {
  const data: IExpenseByMonth[] = expensesData.map((month: any) => {
    return {
      _id: month._id,
      budget: budgetsData.find((b: any) => b._id === month._id)?.amount,
      total: month.total,
      expenses: month.expenses.map((e: ReportedExpense) =>
        pick(
          {
            ...e,
            category: pick(
              month.categories?.find(
                (cat: any) => cat._id?.toString() === e.categoryId?.toString()
              ),
              ["label", "color", "group"]
            ),
          },
          ["title", "description", "date", "amount", "category"]
        )
      ),
    };
  });

  return data;
}

// Generate summary for list of expenses in a given month
export function generateSummary(expenses: any[]) {
  const byCategory = groupBy(expenses, "category.group");
  return Object.entries(byCategory).map(([group, list]) => {
    return {
      group,
      bySubCategory: groupBy(list, "category.label"),
      list,
      total: getTotalAmount(list),
    };
  });
}

export function getTotalAmount(list: any[]): number {
  return list.reduce((sum, curr) => sum + curr.amount, 0);
}
