import routeHandler from "express-async-handler";
import { Types } from "mongoose";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import User from "../models/user.model";
import { IExportingBudget } from "../types/reportingdata";
import { TypedRequest } from "../types/requests";
import { buildPDF } from "../utils/reportGenerator";

export const generateReport = routeHandler(
  async (
    req: TypedRequest<{ startDate: string; endDate: string }, {}>,
    res: any
  ) => {
    const user = await User.findById(req.userId);
    const expensesData = await Expense.aggregate([
      {
        $match: {
          user: new Types.ObjectId(req.userId),
          plan: null,
          date: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate),
          },
        },
      },
      { $sort: { date: -1 } },
      {
        $group: {
          //   _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          _id: { $substrCP: ["$date", 0, 7] },
          expenses: { $push: "$$ROOT" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: "categories",
          localField: "expenses.categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
    ]);

    const budgetsData: IExportingBudget[] = (
      await Budget.aggregate([
        {
          $match: {
            user: new Types.ObjectId(req.userId),
            month: {
              $gte: new Date(req.query.startDate).getMonth() - 1,
              $lte: new Date(req.query.endDate).getMonth() + 1,
            },
            year: {
              $gte: new Date(req.query.startDate).getFullYear(),
              $lte: new Date(req.query.endDate).getFullYear(),
            },
          },
        },
        { $project: { _id: false, user: false, __v: false } },
      ])
    ).map((b) => ({
      amount: b.amount,
      _id: `${b.year}-${String(b.month + 1).padStart(2, "0")}`,
    }));

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=report.pdf",
    });

    buildPDF(
      req.query.startDate,
      req.query.endDate,
      expensesData,
      budgetsData,
      user,
      (o: any) => stream.write(o),
      () => stream.end()
    );
  }
);
