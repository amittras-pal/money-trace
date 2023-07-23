import dayjs from "dayjs";
import PDFDoc from "pdfkit";
import { IExpenseByMonth, IExportingBudget } from "../types/reportingdata";
import {
  addDocumentMeta,
  addIncompleteMonthNotice,
  addReportInfo,
  formatCurrency,
  generateSummary,
  getPercentage,
  getSeverityColor,
  getTotalAmount,
  mergeBudgetsInExpense,
  setDocumentFont,
  xPos,
} from "./generatorUtils";

export async function buildPDF(
  startDate: string,
  endDate: string,
  expensesData: IExpenseByMonth[],
  budgetsData: IExportingBudget[],
  user: any,
  onData: any,
  onFinish: any
) {
  // transform data
  const data = mergeBudgetsInExpense(expensesData, budgetsData);
  // create handler
  const doc = new PDFDoc({ margin: 30, size: "A4", lang: "en" });
  // Alignment utility
  const alignCenter = { width: doc.page.width - xPos * 2, align: "center" };
  // font
  await setDocumentFont(doc);

  // callbacks
  doc.on("data", onData);
  doc.on("end", onFinish);

  // metadata
  addDocumentMeta(doc, user);

  // Heading
  doc
    .fontSize(32)
    .fillColor("black")
    .text("MTrace Expense Report", alignCenter);

  // Related info
  addReportInfo(doc, user, startDate, endDate);

  // Add New page for each month
  data.forEach((month) => {
    doc.addPage();
    doc
      .fontSize(24)
      .fillColor("black")
      .text(dayjs(month._id).format("MMMM, 'YY"));

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
      .fillColor(getSeverityColor(month.total, month.budget))
      .text(` (${getPercentage(month.total, month.budget).toFixed(2)} %)`);

    addIncompleteMonthNotice(doc, month, startDate, endDate);

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
        .fontSize(16)
        .fillColor("black")
        .text(`${g.group}: ${formatCurrency(g.total)}`);
      Object.entries(g.bySubCategory).forEach(([cat, list]) => {
        doc
          .fillColor("black", 0.5)
          .fontSize(14)
          .text(`•  ${cat}: `, { continued: true, indent: 16 })
          .fillColor("black", 1)
          .text(`${formatCurrency(getTotalAmount(list))}`);
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

  doc.addPage();
  doc
    .fontSize(28)
    .fillColor("black", 0.5)
    .text("-•-•-•- End of Report -•-•-•-", alignCenter);
  doc.end();
}
