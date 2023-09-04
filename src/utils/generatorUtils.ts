import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { readFile } from "fs/promises";
import { groupBy, pick } from "lodash";
import { IExpenseByMonth, ReportedExpense } from "../types/reportingdata";
import { IUser } from "../types/user";
import { colorMap } from "./colormap";

dayjs.extend(utc);
dayjs.extend(timezone);

export const xPos = 25;
const dateFormat = "DD MMM 'YY";
const dateTimePrecise = "DD MMM 'YY @ hh:mm:ss a";
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

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
          ["title", "description", "date", "amount", "category", "linked"]
        )
      ),
    };
  });

  return data;
}

// Add basic metadata to the document
export function addDocumentMeta(doc: PDFKit.PDFDocument, user: IUser) {
  doc.info["Author"] = "MTrace Web";
  doc.info["CreationDate"] = dayjs().tz(user.timeZone).toDate();
  doc.info["Title"] = `${user.userName.replace(" ", "_")}_${dayjs()
    .tz(user.timeZone)
    .format("DD_MM_YYYY")}`;
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

// Adds necessary info in the report
export function writeReportInfo(
  doc: PDFKit.PDFDocument,
  user: IUser,
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
      `${dayjs(startDate).tz(user.timeZone).format(dateFormat)} to ${dayjs(
        endDate
      )
        .tz(user.timeZone)
        .format(dateFormat)}`
    );
  // Generation Date
  doc
    .fillColor("black", 0.5)
    .fontSize(16)
    .text("Generated On: ", { continued: true })
    .fillColor("black", 1)
    .text(dayjs().tz(user.timeZone).format(dateTimePrecise));
}

// Add Heading for the month
export function writeMonthHeader(
  doc: PDFKit.PDFDocument,
  month: IExpenseByMonth,
  user: IUser
) {
  doc
    .fontSize(24)
    .fillColor("black")
    .text(dayjs(month._id).tz(user.timeZone).format("MMMM, 'YY"));

  doc
    .fontSize(16)
    .fillColor("black")
    .text(`Set Budget: ${formatCurrency(month.budget)}`, {
      continued: true,
    })
    .text(" || ", { continued: true })
    .text(`Total Spent: ${formatCurrency(month.total)}`, {
      continued: true,
    })
    .fillColor(colorMap[getSeverityColor(month.total, month.budget)][8])
    .text(` (${getPercentage(month.total, month.budget).toFixed(2)} %)`);
}

// Adds a notice for an incomplete month, if detected
export function writeIncompleteMonthNotice(
  doc: PDFKit.PDFDocument,
  month: IExpenseByMonth,
  startDate: string,
  endDate: string,
  user: IUser
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

  if (beginningMismatch || endingMismatch) {
    doc.fillColor("red", 1).text(`Summary Incomplete || `, { continued: true });
    if (beginningMismatch) {
      doc.text(
        `Starts On: ${dayjs(startDate).tz(user.timeZone).date()} ${
          endingMismatch ? " || " : ""
        }`,
        {
          continued: endingMismatch,
        }
      );
    }
    if (endingMismatch) {
      doc.text(`Ends On: ${dayjs(endDate).tz(user.timeZone).date()}`);
    }
  }
}

// write summary data to the month page
export function writeMonthSummary(
  month: IExpenseByMonth,
  doc: PDFKit.PDFDocument
) {
  const summary = generateSummary(month.expenses);
  summary.forEach((g) => {
    doc
      .moveDown(1)
      .fontSize(16)
      .fillColor(colorMap[g.color][8])
      .text(`${g.group}: ${formatCurrency(g.total)}`);
    Object.entries(g.bySubCategory).forEach(([cat, list]) => {
      doc
        .fillColor(colorMap[g.color][6])
        .fontSize(14)
        .text(`•  ${cat}: `, { continued: true, indent: 16 })
        .fillColor("black", 1)
        .text(`${formatCurrency(getTotalAmount(list))}`);
    });
  });
  doc.moveDown(1);
}

// currency format
function formatCurrency(amount: number | undefined) {
  return amount ? currencyFormatter.format(amount) : "";
}

function getPercentage(amount: number, budget: number): number {
  return (amount / budget) * 100;
}

function getSeverityColor(amount: number, budget: number) {
  const perc = getPercentage(amount, budget);
  if (perc <= 45) return "green";
  else if (perc > 45 && perc <= 70) return "yellow";
  else if (perc > 70 && perc <= 90) return "orange";
  else return "red";
}

// Generate summary for list of expenses in a given month
function generateSummary(expenses: any[]) {
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

function getTotalAmount(list: any[]): number {
  return list.reduce((sum, curr) => sum + curr.amount, 0);
}
