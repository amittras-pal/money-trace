import routeHandler from "express-async-handler";
import { statsMessages } from "../constants/apimessages";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import User from "../models/user.model";
import { TypedResponse } from "../types/requests";
import { IUser } from "../types/user";
import {
  MonthTrendRequest,
  RollingTrendRequest,
} from "../types/utility";
import {
  monthTrendAggregator,
  rollingBudgetsAggregator,
  rollingTrendAggregator,
} from "../utils/aggregators";

/**
 * @description Get rolling N-month trend of expense amount against budget, with category grouping.
 * @method GET /api/statistics/rolling-stats
 * @access protected
 */
export const rollingStats = routeHandler(
  async (req: RollingTrendRequest, res: TypedResponse) => {
    const user: IUser | null = await User.findById(req.userId);
    const months = Number.parseInt(req.query.months) || 6;

    const trend = await Expense.aggregate(
      rollingTrendAggregator(user, months),
    );
    const budgets = await Budget.aggregate(
      rollingBudgetsAggregator(req, user, months),
    );

    res.json({
      message: statsMessages.rollingStats,
      response: { trend, budgets, months: months },
    });
  },
);

/**
 * // IMPLEMENT: Unused by frontend as of now!
 *
 * @description Get the count and amount of expenses against day for a given month.
 * @method POST /api/statistics/month-stats
 * @access protected
 */
export const monthStats = routeHandler(
  async (req: MonthTrendRequest, res: TypedResponse) => {
    const user: IUser | null = await User.findById(req.userId);
    const data = await Expense.aggregate(monthTrendAggregator(req, user));
    res.json({ message: "Working.", response: data });
  },
);
