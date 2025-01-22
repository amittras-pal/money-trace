import dayjs from "dayjs";
import { Workbook } from "exceljs";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import ExpensePlan from "../models/expensePlan.model";
import User from "../models/user.model";
import { IExportingBudget } from "../types/reportingdata";
import { TypedRequest, TypedResponse } from "../types/requests";
import {
  IReportRequest,
  PlanExportContent,
  PlanExportRequest,
} from "../types/utility";
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

/**
 * @description export expenses for a selected date range
 * @method GET /api/reports/
 * @access protected
 */
export const exportRangeReport = routeHandler(
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
        for (const expense of month.expenses) {
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
        }
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
            cell.font = getDataFont(cat.color!, false);
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

/**
 * @description export expenses for a plan
 * @method GET /api/reports/plan
 * @access protected
 */
export const exportPlan = routeHandler(
  async (req: PlanExportRequest, res: TypedResponse) => {
    const user = await User.findById(req.userId);
    const planDetails = await ExpensePlan.findById(req.query.plan);

    if (!planDetails) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Plan not found");
    }

    const expenses: PlanExportContent[] = await Expense.aggregate([
      {
        $match: {
          plan: new Types.ObjectId(req.query.plan),
          user: new Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          "category._id": false,
          "category.__v": false,
          categoryId: false,
        },
      },
    ]);

    const totalSpent = expenses.reduce((total, ex) => {
      return total + ex.amount;
    }, 0);

    const categoryGroup = expenses.reduce(
      (coll: Record<string, { total: number; color: string }>, ex) => {
        if (ex.category.group in coll) {
          const groupTotal = coll[ex.category.group].total;
          const groupColor = coll[ex.category.group].color;
          return {
            ...coll,
            [ex.category.group]: {
              total: groupTotal + ex.amount,
              color: groupColor,
            },
          };
        } else
          return {
            ...coll,
            [ex.category.group]: { total: ex.amount, color: ex.category.color },
          };
      },
      {}
    );

    const book = new Workbook();

    const summary = book.addWorksheet("Plan Summary");
    summary.columns = [
      { width: 35, alignment: { vertical: "top" } },
      { width: 35, alignment: { vertical: "top" } },
    ];
    // write the plan details
    summary.addRow(["Plan Name", planDetails.name]);
    summary.addRow(["Description", planDetails.description]);
    summary.addRow(["Created On", planDetails.createdAt]);
    summary.addRow(["Last Updated", planDetails.updatedAt]);
    summary.addRow(["User", user?.userName]);
    summary.addRow(["Plan is Active", planDetails.open ? "Yes" : "No"]);
    summary.addRows(Array.from({ length: 2 }));
    // Write Plan Expenses Summary
    summary.addRow(["Category Breakdown"]);
    Object.entries(categoryGroup).forEach((entry) => {
      const row = summary.addRow([entry[0], entry[1].total]);
      row.getCell("B").numFmt = currencyFormat;

      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.fill = getDataFill(entry[1].color);
        cell.font = getDataFont(entry[1].color, false);
      });
    });
    summary.addRows(Array.from({ length: 1 }));
    const totalRow = summary.addRow(["Total Spent", totalSpent]);
    totalRow.getCell("A").font = { bold: true };
    totalRow.getCell("B").numFmt = currencyFormat;

    // Create new Sheet for expenses list.
    const list = book.addWorksheet("Expenses List");
    list.columns = dataColumns;
    const listRows = list.addRows(
      expenses.map((e) => ({
        ...e,
        categoryName: e.category.group,
        subCategoryName: e.category.label,
      }))
    );
    listRows.forEach((row, i) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.fill = getDataFill(expenses[i].category.color);
        cell.font = getDataFont(expenses[i].category.color, false);
        cell.border = dataRowBorder;
      });
    });

    // send for download
    res.setHeader("Content-Type", contentTypeXLSX);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Plan-${planDetails._id}.xlsx`
    );
    book.xlsx.write(res).then(() => res.end());
  }
);
