import dayjs from "dayjs";
import { readFile } from "fs/promises";
import { groupBy } from "lodash";
import pick from "lodash/pick";
import PDFDoc from "pdfkit";
import {
  IExpenseByMonth,
  IExportingBudget,
  ReportedExpense,
} from "../types/reportingdata";

export async function buildPDF(
  startDate: string,
  endDate: string,
  expensesData: IExpenseByMonth[],
  budgetsData: IExportingBudget[],
  user: any,
  onData: any,
  onFinish: any
) {
  const data = mergeBudgetsInExpense(expensesData, budgetsData);
  const doc = new PDFDoc({ margin: 30, size: "A4", lang: "en" });
  const alignCenter = { width: doc.page.width - xPos * 2, align: "center" };
  //   doc.font("../assets/fonts/CrimsonPro-VariableFont_wght.ttf");
  const fontFile = await readFile(
    "src/assets/fonts/static/CrimsonPro-Regular.ttf"
  );
  doc.registerFont("Crimson", fontFile);

  doc.on("data", onData);
  doc.on("end", onFinish);

  doc.font("Crimson");
  doc.info["Title"] = `${user.userName.replace(" ", "_")}_${dayjs().format(
    "DD_MM_YYYY"
  )}`;
  (doc.info["Author"] = "MTrace Web"),
    (doc.info["CreationDate"] = dayjs().toDate());

  doc
    .fontSize(32)
    .fillColor("black")
    .text("MTrace Expense Report", alignCenter)
    .text(
      `${dayjs(startDate).format(dateFormat)} - ${dayjs(endDate).format(
        dateFormat
      )}`,
      alignCenter
    )
    .text("Grouped by month.", alignCenter);

  doc.moveDown(2);
  doc
    .fillColor("black", 0.5)
    .fontSize(28)
    .text(`User: ${user.userName}`, alignCenter);

  data.forEach((month) => {
    doc.addPage();
    doc
      .fontSize(24)
      .fillColor("black")
      .text(dayjs(month._id).format("MMMM, 'YY"));
    doc
      .fontSize(16)
      .fillColor("black")
      .text(`Set Budget: ${formatCurrency(month.budget)}  `, {
        continued: true,
      })
      .text(" || ", { continued: true })
      .text(`Total Spent: ${formatCurrency(month.total)}  `, {
        continued: true,
      })
      .fillColor(getSeverityColor(month.total, month.budget))
      .text(`  (${getPercentage(month.total, month.budget).toFixed(2)} %)`);

    doc
      .moveDown(1)
      .fontSize(18)
      .fillColor("gray")
      .text("Breakdown by Category: ");
    doc
      .moveTo(xPos, doc.y)
      .lineTo(doc.page.width - xPos, doc.y)
      .strokeOpacity(0.7)
      .stroke("gray");

    const summary = generateSummary(month.expenses);
    summary.forEach((g) => {
      doc
        .moveDown(1)
        .fontSize(14)
        .fillColor("black")
        .text(`${g.group}: ${formatCurrency(g.total)}`);
      Object.entries(g.bySubCategory).forEach(([cat, list]) => {
        doc
          .fillColor("black", 0.5)
          .text(`--- ${cat}: `, { continued: true })
          .fillColor("black", 1)
          .text(
            `${formatCurrency(
              list.reduce((sum, curr) => sum + curr.amount, 0)
            )}`
          );
      });
    });

    doc.moveDown(1);

    doc
      .moveTo(xPos, doc.y)
      .lineTo(doc.page.width - xPos, doc.y)
      .strokeOpacity(0.7)
      .strokeColor("black", 0.75);
    doc.moveDown(1);
  });

  doc.end();
}

const dateFormat = "DD MMM 'YY";
// const dateTimeFormat = "DD MMM 'YY, hh:mm a";
const xPos = 25;
const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function formatCurrency(amount: number | undefined) {
  return amount ? formatter.format(amount) : "";
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

function mergeBudgetsInExpense(expensesData: any, budgetsData: any) {
  const data: IExpenseByMonth[] = expensesData.map((month: any) => ({
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
  }));

  return data;
}

function generateSummary(expenses: any[]) {
  const byCategory = groupBy(expenses, "category.group");
  return Object.entries(byCategory).map(([group, list]) => {
    return {
      group,
      bySubCategory: groupBy(list, "category.label"),
      list,
      total: list.reduce((sum, curr) => sum + curr.amount, 0),
    };
  });
}
