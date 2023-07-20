import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import Expense from "../models/expense.model";
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

/**
 * @description This method is used to get expense plans created by an user
 * @method GET /api/expense-plan/
 * @access protected
 */
export const getExpensePlans = routeHandler(
  async (
    req: TypedRequest<{ open: string }>,
    res: TypedResponse<IExpensePlan[]>
  ) => {
    const plans: IExpensePlan[] | null = await ExpensePlan.find({
      user: new Types.ObjectId(req.userId),
    }).sort({ updatedAt: -1 });

    res.json({ message: "Plans Retrieved", response: plans });
  }
);

/**
 * @description This method is used to get details of a single expense plan
 * @method GET /api/expense-plan/details
 * @access protected
 */
export const getPlanDetails = routeHandler(
  async (req: TypedRequest<{ _id: string }>, res: TypedResponse) => {
    const plan = await ExpensePlan.findOne({
      user: new Types.ObjectId(req.userId),
      _id: new Types.ObjectId(req.query._id),
    });
    if (!plan) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Plan Not Found");
    }

    res.json({ message: "Details Retrieved", response: plan });
  }
);

/**
 * @description This method is used to update an expense plan
 * @method PUT /api/expense-plan/
 * @access protected
 */
export const updatePlan = routeHandler(
  async (
    req: TypedRequest<{}, Partial<IExpensePlan>>,
    res: TypedResponse<IExpensePlan | null>
  ) => {
    const plan: IExpensePlan | null = await ExpensePlan.findById(req.body._id);

    if (!plan) throw new Error("Expense Plan not found.");
    const update: IExpensePlan | null = await ExpensePlan.findByIdAndUpdate(
      req.body._id,
      {
        $set: { ...req.body, lastAction: req.body.open ? "Updated" : "Closed" },
      },
      { new: true }
    );
    res.json({
      message: "Expense plan updated successfully",
      response: update,
    });
  }
);

/**
 * @description This method is used to delete an expense plan
 * @method DELETE /api/expense-plan/
 * @access protected
 */
export const deletePlan = routeHandler(
  async (req: TypedRequest<{ _id: string }, {}>, res: TypedResponse) => {
    const plan: IExpensePlan | null = await ExpensePlan.findById(req.query._id);

    if (!plan) throw new Error("Expense Plan not found.");
    await ExpensePlan.findByIdAndDelete(req.query._id);
    const result = await Expense.deleteMany({
      plan: new Types.ObjectId(req.query._id),
    });
    console.log(result);

    res.json({
      message: `Expense plan deleted! ${result.deletedCount} Expenses deleted`,
    });
  }
);
