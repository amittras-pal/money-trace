import dayjs from "dayjs";
import { Workbook } from "exceljs";
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
  currencyFormat,
  dataColumns,
  dataRowBorder,
  generateSummary,
  getColor,
  getDataFill,
  getDataFont,
  getIncompleteNotice,
  getSeverityColor,
  getTotalAmount,
  getZonedTime,
  headerBg,
  headerBorder,
  mergeBudgetsInExpense,
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

      // Write Expense List [if requested]
      if (req.query.includeList === "true") {
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
            cell.fill = getDataFill(expense.category.color!);
            cell.font = getDataFont(expense.category.color!, col === 3);
          });
        });

        // Style the header.
        const dataHeader = sheet.getRow(1);
        dataHeader.eachCell((cell) => {
          cell.font = { bold: true, size: 14 };
          cell.border = headerBorder;
          cell.fill = headerBg;
        });
      }

      // Add empty rows at the top of the sheet, for Summary content.
      sheet.insertRows(0, Array.from({ length: 5 }).fill({}));

      // Write amount Summary.
      sheet.columns = summaryColumns;
      const summaryRow = sheet.insertRow(2, month);
      summaryRow.eachCell({ includeEmpty: false }, (cell, col) => {
        const percColor = getSeverityColor(month.total, month.budget);
        const percColorCode = getColor(percColor, 6);
        cell.border = dataRowBorder;
        cell.font = {
          bold: true,
          color: { argb: col === 3 ? percColorCode.argb : "000" },
        };
      });

      // Style amount Summary
      const summaryHeader = sheet.getRow(1);
      summaryHeader.eachCell({ includeEmpty: false }, (cell) => {
        cell.font = { bold: true, size: 14 };
        cell.border = headerBorder;
        cell.fill = headerBg;
      });

      // Add notice if incomplete.
      const notice = getIncompleteNotice(user, req.query, month);
      if (notice.length > 0) {
        const noticeRange = "A3:C3";
        sheet.mergeCells(noticeRange);
        const noticeCell = sheet.getCell(noticeRange);
        noticeCell.value = { richText: notice };
        noticeCell.border = dataRowBorder;
        noticeCell.alignment = { horizontal: "center", vertical: "middle" };
        noticeCell.fill = getDataFill("red");
      }

      // Write Breakdown by category and subcategory.
      let startRow = 5;
      let endRow = 5;
      const breakDownHeaderRange = `A${startRow}:C${startRow}`;
      sheet.mergeCells(breakDownHeaderRange);
      const breakdownCell = sheet.getCell(breakDownHeaderRange);
      breakdownCell.value = "Breakdown by Category";
      breakdownCell.fill = headerBg;
      breakdownCell.border = headerBorder;
      breakdownCell.font = { bold: true, size: 14 };
      breakdownCell.alignment = { horizontal: "center" };
      startRow++;
      endRow++;

      const summary = generateSummary(month.expenses);
      for (const cat of summary) {
        const cHead = sheet.insertRow(endRow, [cat.group, "", cat.total]);
        cHead.eachCell({ includeEmpty: false }, (cell, col) => {
          cell.font = { ...getDataFont(cat.color!, true), size: 12 };
          cell.fill = getDataFill(cat.color!);
          cell.numFmt = col === 3 ? currencyFormat : "";
          cell.border = dataRowBorder;
        });
        endRow++;

        const subCategories = Object.entries(cat.bySubCategory);
        for (const [name, list] of subCategories) {
          const amount = getTotalAmount(list);
          const subCatEntry = sheet.insertRow(endRow, ["", name, amount]);
          subCatEntry.eachCell({ includeEmpty: false }, (cell, col) => {
            cell.font = { ...getDataFont(cat.color!, false) };
            cell.fill = getDataFill(cat.color!);
            cell.numFmt = col === 3 ? currencyFormat : "";
            cell.border = dataRowBorder;
          });
          endRow++;
        }

        const categoryRange = `A${startRow}:A${endRow - 1}`;
        startRow = endRow;
        sheet.mergeCells(categoryRange);
        sheet.getCell(categoryRange).alignment = {
          vertical: "top",
          horizontal: "right",
        };
      }
    });

    // Send for download.
    res.setHeader("Content-Type", contentTypeXLSX);
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
    book.xlsx.write(res).then(() => res.end());
  }
);
