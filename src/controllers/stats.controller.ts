import routeHandler from "express-async-handler";
import { Types } from "mongoose";
import { statsMessages } from "../constants/apimessages";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import User from "../models/user.model";
import { TypedResponse } from "../types/requests";
import { IUser } from "../types/user";
import { YearTrendRequest } from "../types/utility";
import { yearTrendAggregator } from "../utils/aggregators";

export const yearStats = routeHandler(
  async (req: YearTrendRequest, res: TypedResponse) => {
    const user: IUser | null = await User.findById(req.userId);
    const budgets = await Budget.aggregate([
      {
        $match: {
          user: new Types.ObjectId(req.userId),
          year: parseInt(req.query.year),
        },
      },
      { $addFields: { month: { $sum: ["$month", 1] } } },
      { $project: { month: 1, amount: 1, _id: 0 } },
    ]);

    const trend = await Expense.aggregate(yearTrendAggregator(req, user));

    res.json({
      message: statsMessages.yearStats,
      response: { trend, budgets },
    });
  }
);
