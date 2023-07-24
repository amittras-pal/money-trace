import PDFDoc from "pdfkit";
import { IExpenseByMonth, IExportingBudget } from "../types/reportingdata";
import {
  addDocumentMeta,
  mergeBudgetsInExpense,
  setDocumentFont,
  writeIncompleteMonthNotice,
  writeMonthHeader,
  writeMonthSummary,
  writeReportInfo,
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
  writeReportInfo(doc, user, startDate, endDate);

  // Add New page for each month
  data.forEach((month) => {
    doc.addPage();
    writeMonthHeader(doc, month, user);
    writeIncompleteMonthNotice(doc, month, startDate, endDate, user);

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

    writeMonthSummary(month, doc);
  });

  // Extra page with doc end
  doc.addPage();
  doc
    .fontSize(28)
    .fillColor("black", 0.5)
    .text("-•-•-•- End of Report -•-•-•-", alignCenter);
  doc.end();
}
