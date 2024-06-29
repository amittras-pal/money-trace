import dayjs from "dayjs";
import { RichText, Workbook } from "exceljs";
import routeHandler from "express-async-handler";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import User from "../models/user.model";
import { IExportingBudget, ReportedExpense } from "../types/reportingdata";
import { TypedRequest, TypedResponse } from "../types/requests";
import { IReportRequest } from "../types/utility";
import {
  budgetAggregator,
  reportExpenseAggregator,
} from "../utils/aggregators";
import {
  contentTypeXLSX,
  currentcyFormat,
  dataColumns,
  dataRowBorder,
  getColor,
  getDataDataRowFont,
  getDataRowFill,
  getRangeCaps,
  getSeverityColor,
  getZonedTime,
  headerBg,
  headerBorder,
  mergeBudgetsInExpense,
  percentageFormat,
  summaryColumns,
} from "../utils/excelUtils";

export const generateReport = routeHandler(
  async (req: TypedRequest<IReportRequest>, res: TypedResponse) => {
    // Download and format Data
    const user = await User.findById(req.userId);
    const expenses = await Expense.aggregate(
      reportExpenseAggregator(req.query, req.userId!)
    );
    const budgets: IExportingBudget[] = (
      await Budget.aggregate(budgetAggregator(req.query, req.userId!))
    ).map((b) => ({
      amount: b.amount,
      _id: `${b.year}-${String(b.month + 1).padStart(2, "0")}`,
    }));

    const data = mergeBudgetsInExpense(expenses, budgets);
    const book = new Workbook();

    data.forEach((month) => {
      // Create new Sheet for every month
      const sheet = book.addWorksheet(dayjs(month._id).format("MMM YYYY"));

      // Write Expense List.
      sheet.columns = dataColumns;
      month.expenses.forEach((expense: ReportedExpense) => {
        const row = sheet.addRow({
          ...expense,
          categoryName: expense.category.group,
          subCategoryName: expense.category.label,
          date: getZonedTime(user, expense.date, true),
        });
        row.eachCell({ includeEmpty: false }, (cell, col) => {
          cell.border = dataRowBorder;
          cell.fill = getDataRowFill(expense);
          cell.font = getDataDataRowFont(expense, col === 3);
        });
      });

      // Format the amount and date columns.
      sheet.getColumn("amount").numFmt = currentcyFormat;

      // Style the header.
      const dataHeader = sheet.getRow(1);
      dataHeader.eachCell((cell) => {
        cell.font = { bold: true, size: 14 };
        cell.border = headerBorder;
        cell.fill = headerBg;
      });

      // Add empty rows at the top of the sheet, for Summary content.
      sheet.insertRows(0, Array.from({ length: 4 }).fill({}));

      // Write Summary.
      sheet.columns = summaryColumns;
      const summaryRow = sheet.insertRow(2, month);
      summaryRow.eachCell((cell, col) => {
        const percColor = getSeverityColor(month.total, month.budget);
        const percColorCode = getColor(percColor, 6);
        cell.border = dataRowBorder;
        cell.numFmt = col === 6 ? percentageFormat : currentcyFormat;
        cell.font = {
          bold: true,
          color: { argb: col === 6 ? percColorCode.argb : "000" },
        };
      });
      // Style Summary
      const summaryHeader = sheet.getRow(1);
      summaryHeader.eachCell((cell) => {
        cell.font = { bold: true, size: 14 };
        cell.border = headerBorder;
        cell.fill = headerBg;
      });

      // Detect completeness of the month by date range to add warning.
      const monthCaps = getRangeCaps(
        user,
        month,
        req.query.startDate,
        req.query.endDate
      );
      // Add notice if incomplete.
      if (monthCaps.beginningMismatch || monthCaps.endingMismatch) {
        const notice: RichText[] = [];
        const noticeColor = getColor("red", 8);
        notice.push({
          text: "Summary Incomplete: ",
          font: { bold: true, color: noticeColor },
        });
        if (monthCaps.beginningMismatch)
          notice.push(
            { text: "Starts On: ", font: { bold: true } },
            {
              text: getZonedTime(user, req.query.startDate),
              font: { bold: true, color: noticeColor },
            }
          );
        if (monthCaps.beginningMismatch && monthCaps.endingMismatch)
          notice.push({ text: "  ||  ", font: { bold: true } });
        if (monthCaps.endingMismatch)
          notice.push(
            { text: "Ends On: ", font: { bold: true } },
            {
              text: getZonedTime(user, req.query.endDate),
              font: { bold: true, color: noticeColor },
            }
          );

        sheet.mergeCells("D3:F3");
        const noticeCell = sheet.getCell("D3:F3");
        noticeCell.value = { richText: notice };
        noticeCell.border = dataRowBorder;
        noticeCell.alignment = { horizontal: "center", vertical: "middle" };
      }
    });

    // Send for download.
    res.setHeader("Content-Type", contentTypeXLSX);
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
    book.xlsx.write(res).then(() => res.end());
  }
);
