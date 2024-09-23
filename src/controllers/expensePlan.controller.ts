import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import omit from "lodash/omit";
import { Types } from "mongoose";
import { expensePlanMessages } from "../constants/apimessages";
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
        message: expensePlanMessages.expensePlanCreatedSuccessfully,
      });
    } else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: expensePlanMessages.somethingWentWrongWhileCreatingExpensePlan,
      });
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

    res.json({
      message: expensePlanMessages.plansRetrieved,
      response: plans,
    });
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

    res.json({
      message: expensePlanMessages.detailsRetrieved,
      response: plan,
    });
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
      message: expensePlanMessages.expensePlanUpdatedSuccessfully,
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

    res.json({
      message: `Expense plan deleted! ${result.deletedCount} Expenses deleted`,
    });
  }
);

/**
 * @description Copy a list of expenses to the general budget
 * @method POST /api/expense-plan/copy-to-budget
 * @access protected
 */
export const copyExpensesToBudget = routeHandler(
  async (req: TypedRequest<{}, { expenses: string[] }>, res: TypedResponse) => {
    const selectedExpenses = await Expense.find({
      _id: { $in: req.body.expenses },
    });

    // Create new expenses with linked value populated
    const budgetsForExpenses = selectedExpenses.map((ex) => ({
      ...omit(ex, ["_id", "plan"]),
      linked: ex._id,
    }));
    const created = await Expense.insertMany(budgetsForExpenses);

    // Update the original expenses with linked values from the new ones.
    selectedExpenses.forEach((oldEx) => {
      oldEx.linked = new Types.ObjectId(
        created.find((newEx) => newEx.linked === oldEx._id)?._id
      );
      oldEx.save();
    });

    res.json({
      message: `${req.body.expenses.length} expenses successfullly copied to budget.`,
      response: created,
    });
  }
);
