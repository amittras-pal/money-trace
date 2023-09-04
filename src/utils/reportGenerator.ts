import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import PDFDoc from "pdfkit";
import pdftable from "voilab-pdf-table";
import { IExpenseByMonth, IExportingBudget } from "../types/reportingdata";
import { colorMap } from "./colormap";
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

dayjs.extend(timezone);
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
function percent(total: number, perc: number) {
  return Math.floor(total * (perc / 100));
}

export async function buildPDF(
  startDate: string,
  endDate: string,
  includeList: string,
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
  const table = new pdftable(doc, { bottomMargin: 20 });
  table
    .setColumnsDefaults({
      align: "left",
      headerHeight: 30,
      headerBorder: "B",
      headerBorderOpacity: 0.5,
      headerPadding: [8, 4],
      border: "B",
      borderOpacity: 0.25,
      padding: [8, 4],
    })
    .onRowAdd((table, row: any) => {
      const category = row.category ? JSON.parse(row.category.toString()) : {};
      table.pdf
        .rect(
          xPos + 5,
          table.pdf.y,
          table.pdf.page.width - xPos * 2,
          row._renderedContent.height
        )
        .fill(colorMap[category.color][1], "even-odd");
      table.pdf.opacity(1).fillColor(colorMap[category.color][8]);
    })
    .onRowAdded((table) => table.pdf.fillColor("black"))
    .onPageAdded((table, row: any) => {
      const category = row.category ? JSON.parse(row.category.toString()) : {};
      table.pdf
        .rect(
          xPos + 5,
          table.pdf.y,
          table.pdf.page.width - xPos * 2,
          row._renderedContent.height
        )
        .fill(colorMap[category.color][1], "even-odd");
      table.pdf.opacity(1).fillColor(colorMap[category.color][8]);
    })
    .addColumns([
      {
        id: "title",
        header: "Title",
        width: percent(doc.page.width - xPos * 2, 25),
        renderer: (_, data) =>
          data.linked ? "[Created in a plan]\n" + data.title : data.title,
      },
      {
        id: "description",
        header: "Description",
        width: percent(doc.page.width - xPos * 2, 40),
        renderer: (_, data) => data.description || "---",
      },
      {
        id: "amount",
        header: "Amount",
        width: percent(doc.page.width - xPos * 2, 15),
        renderer: (_, data) => {
          const amount: number | bigint = data.amount
            ? parseInt(data.amount.toString())
            : 0;
          return currencyFormatter.format(amount);
        },
      },
      {
        id: "date",
        header: "Date",
        width: percent(doc.page.width - xPos * 2, 20),
        renderer: (_, data) => {
          return dayjs(data.date).tz(user.timeZone).format("DD MMM hh:mm a");
        },
      },
    ]);
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

    if (includeList === "true") {
      doc.moveDown(1).fontSize(18).fillColor("gray").text("Expenses List: ");
      doc
        .moveTo(xPos, doc.y)
        .lineTo(doc.page.width - xPos, doc.y)
        .strokeOpacity(0.7)
        .stroke("gray");

      doc.fontSize(12);
      const data = month.expenses.map((ex) => ({
        title: ex.title,
        description: ex.description,
        // plan: ex.plan?.toString(),
        linked: ex.linked?.toString(),
        amount: ex.amount.toString(),
        date: ex.date.toISOString(),
        category: JSON.stringify(ex.category),
      }));
      table.addBody(data);
    }
  });

  // Extra page with doc end
  doc.addPage();
  doc
    .fontSize(28)
    .fillColor("black", 0.5)
    .text("-•-•-•- End of Report -•-•-•-", alignCenter);
  doc.end();
}
