import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ExpensePlan from "../models/expensePlan.model";
import { IExpensePlan } from "../types/expensePlan";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method is used to create an expense plan
 * @method POST /api/expense-plan/
 * @access protected
 */
export const createExpensePlan = routeHandler(
  async (req: TypedRequest<{}, Partial<IExpensePlan>>, res: TypedResponse) => {
    const userId = req.userId;
    const { name, description } = req.body;
    const created = await ExpensePlan.create({
      user: userId,
      name,
      description,
    });
    if (created) {
      res.status(StatusCodes.OK).json({
        message: "Expense plan created successfully",
      });
    } else
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong while creating expense plan" });
  }
);
