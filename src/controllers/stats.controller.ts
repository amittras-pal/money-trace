import routeHandler from "express-async-handler";
import { statsMessages } from "../constants/apimessages";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import User from "../models/user.model";
import { TypedResponse } from "../types/requests";
import { IUser } from "../types/user";
import { MonthTrendRequest, YearTrendRequest } from "../types/utility";
import {
  budgetsOfYearAggregator,
  monthTrendAggregator,
  yearTrendAggregator,
} from "../utils/aggregators";

/**
 * @description Get the trend of expense amount against budget per month; along with category grouping for each month.
 * @method POST /api/statistics/year-stats
 * @access protected
 */
export const yearStats = routeHandler(
  async (req: YearTrendRequest, res: TypedResponse) => {
    const user: IUser | null = await User.findById(req.userId);
    const budgets = await Budget.aggregate(budgetsOfYearAggregator(req));
    const trend = await Expense.aggregate(yearTrendAggregator(req, user));

    res.json({
      message: statsMessages.yearStats,
      response: { trend, budgets },
    });
  }
);

/**
 * // TODO: unused by frontend as of now.
 * @description Get the count and amount of expenses against day for a given month.
 * @method POST /api/statistics/month-stats
 * @access protected
 */
export const monthStats = routeHandler(
  async (req: MonthTrendRequest, res: TypedResponse) => {
    const user: IUser | null = await User.findById(req.userId);
    const data = await Expense.aggregate(monthTrendAggregator(req, user));
    res.json({ message: "Working.", response: data });
  }
);
