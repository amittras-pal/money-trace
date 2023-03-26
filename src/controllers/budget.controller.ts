import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Budget from "../models/budget.model";
import { IBudget } from "../types/budget";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method is used to create the budget for a given month and year for a user
 * @method POST /api/budget
 * @access protected
 */
export const createBudget = routeHandler(
  async (req: TypedRequest<{}, Partial<IBudget>>, res: TypedResponse) => {
    const { userId } = req;
    const { month, year, amount } = req.body;
    await Budget.create({
      user: userId,
      month,
      year,
      amount,
    });
    res.status(StatusCodes.OK).json({ message: "Budget created successfully" });
  }
);

/**
 * @description Retrieve the budget by month & year
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
      message: "Budget retrieved successfully",
      response: budget,
    });
  }
);
