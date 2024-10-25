import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { budgetMessages } from "../constants/apimessages";
import Budget from "../models/budget.model";
import { IBudget } from "../types/budget";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method is used to create a new budget for a given month and year for a user
 * @method POST /api/budget
 * @access protected
 */
export const createBudget = routeHandler(
  async (
    req: TypedRequest<{}, Pick<IBudget, "month" | "year" | "amount">>,
    res: TypedResponse
  ) => {
    const { userId } = req;
    const { month, year, amount } = req.body;
    const existing = await Budget.findOne({ month, year, user: userId });

    if (existing) {
      res.status(StatusCodes.CONFLICT);
      throw new Error(
        "Budget is already created for the user for the given month."
      );
    }

    await Budget.create({ user: userId, month, year, amount });
    res
      .status(StatusCodes.OK)
      .json({ message: budgetMessages.budgetCreatedSuccessfully });
  }
);

/**
 * @description Retrieve the budget by month & year for a user
 * @method GET /api/budget
 * @access protected
 */
export const getBudget = routeHandler(
  async (
    req: TypedRequest<{ month: string; year: string }, {}>,
    res: TypedResponse<IBudget>
  ) => {
    const { month, year } = req.query;
    if (month === undefined || year === undefined) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Required params are not provided.");
    }

    const budget: IBudget | null = await Budget.findOne({
      user: req.userId,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!budget) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Budget not found");
    }

    res.json({
      message: budgetMessages.budgetRetrievedSuccessfully,
      response: budget,
    });
  }
);
