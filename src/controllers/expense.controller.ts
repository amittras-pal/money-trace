import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { PipelineStage, Types } from "mongoose";
import Expense from "../models/expense.model";
import ExpensePlan from "../models/expensePlan.model";
import { IExpense } from "../types/expense";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * Save a new expense.
 * @description get expenses of a user
 * @method POST /api/expenses
 * @access protected
 */
export const createExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { userId } = req;
    const { title, amount, date, categoryId }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!title || !amount || !date || !categoryId) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    if (req.body.plan) ex.plan = new Types.ObjectId(req.body.plan);
    else ex.plan = null;

    if (req.body.plan) {
      await ExpensePlan.findByIdAndUpdate(req.body.plan, {
        $set: { lastAction: "Expense Added" },
      });
    }

    const expense = new Expense({ ...ex, user: userId });
    await expense.save();

    res.json({ message: "Expense saved successfully." });
  }
);

/**
 * Update an expense.
 * @description get expenses of a user
 * @method PUT /api/expenses
 * @access protected
 */
export const updateExpense = routeHandler(
  async (
    req: TypedRequest<{}, IExpense>,
    res: TypedResponse<IExpense | null>
  ) => {
    const { title, amount, date, categoryId, _id }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!_id || !title || !amount || !date || !categoryId) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    await Expense.findByIdAndUpdate(_id, { $set: ex });
    const update: IExpense | null = await Expense.findById(_id).populate(
      "categoryId"
    );

    if (update?.plan) {
      await ExpensePlan.findByIdAndUpdate(update.plan, {
        $set: { lastAction: "Expense Updated" },
      });
    }

    res.json({ message: "Expense updated successfully.", response: update });
  }
);

/**
 * Delete expense
 * @description Delete a single expense by a user
 * @method DELETE /api/expenses
 * @access protected
 */
export const deleteExpense = routeHandler(
  async (req: TypedRequest<{ id: "string" }, {}>, res: TypedResponse) => {
    const expense: IExpense | null = await Expense.findById(req.query.id);
    if (expense?.plan) {
      await ExpensePlan.findByIdAndUpdate(expense.plan, {
        $set: { lastAction: "Expense Removed" },
      });
    }

    const deleted = await Expense.deleteOne({
      user: new Types.ObjectId(req.userId),
      _id: new Types.ObjectId(req.query.id),
    });

    if (deleted.acknowledged && deleted.deletedCount === 1) {
      res.json({ message: "Expense deleted successfully." });
    } else if (deleted.deletedCount === 0) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("The Expense you're trying to delete does not exist.");
    }
  }
);

/**
 * @description Copies an expense to the regular budget.
 * @method PUT /api/expenses/clone
 * @access protected
 */
export const cloneExpense = routeHandler(
  async (req: TypedRequest<{}, { _id: string }>, res: TypedResponse) => {
    const existing = await Expense.findById(req.body._id);
    const newExpense = await Expense.create({
      amount: existing?.amount,
      categoryId: existing?.categoryId,
      date: existing?.date,
      description: existing?.description,
      plan: null,
      reverted: existing?.reverted,
      title: existing?.title,
      user: existing?.user,
      linked: new Types.ObjectId(existing?._id),
    });

    existing?.set("linked", new Types.ObjectId(newExpense._id));
    existing?.save();

    res.json({ message: "Expense copied to budget successfully!" });
  }
);

/**
 * Save a new expense.
 * @description get expenses summarized by category in the month time frame provided
 * @method GET /api/expenses/summary
 * @access protected
 */
export const getMonthSummary = routeHandler(
  async (
    req: TypedRequest<
      {
        firstDay: string | undefined;
        lastDay: string | undefined;
        plan: string | undefined;
      },
      {}
    >,
    res: TypedResponse<{ summary: Array<any>; total: Number }>
  ) => {
    const { firstDay, lastDay, plan } = req.query;
    const matcher: PipelineStage.Match = {
      $match: {
        user: new Types.ObjectId(req.userId),
        reverted: false,
      },
    };

    if (firstDay?.length && lastDay?.length)
      matcher.$match.date = {
        $gte: new Date(firstDay),
        $lte: new Date(lastDay),
      };

    if (plan?.length) matcher.$match.plan = new Types.ObjectId(plan);
    else matcher.$match.plan = null;

    const summary = await Expense.aggregate([
      matcher,
      {
        $group: {
          _id: "$categoryId",
          value: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $sort: { value: -1 } },
      { $unwind: "$category" },
      {
        $project: {
          _id: false,
          amounts: false,
          "category._id": false,
          "category.__v": false,
        },
      },
      {
        $project: {
          value: "$value",
          label: "$category.label",
          color: "$category.color",
          group: "$category.group",
          icon: "$category.icon",
        },
      },
    ]);

    res.json({
      message: "Summary for the current month retrieved successfully.",
      response: {
        summary: summary.reduce((acc, ci) => {
          if (acc[ci.group]) {
            acc[ci.group].subCategories.push(ci);
            acc[ci.group].total += ci.value;
          } else {
            acc[ci.group] = {
              subCategories: [],
              total: 0,
            };
            acc[ci.group].subCategories.push(ci);
            acc[ci.group].total += ci.value;
          }
          return acc;
        }, {}),
        total: summary.reduce((sum, curr) => sum + curr.value, 0),
      },
    });
  }
);

/**
 * @description Get a list of expenses for a date range.
 * @method POST /api/expenses
 * @access protected
 */
export const listExpenses = routeHandler(
  async (
    req: TypedRequest<
      {},
      {
        startDate: string | undefined;
        endDate: string | undefined;
        plan: string | undefined;
        sort: Record<string, 1 | -1>;
      }
    >,
    res: TypedResponse<IExpense[]>
  ) => {
    const { startDate, endDate, plan, sort } = req.body;

    const matchPhase: PipelineStage.Match = {
      $match: { user: new Types.ObjectId(req.userId) },
    };

    const sortPhase: PipelineStage.Sort = {
      $sort: sort,
    };

    const lookupPhase: PipelineStage.Lookup = {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    };

    const unwindPhase: PipelineStage.Unwind = { $unwind: "$category" };

    // Add start/end date and plan if available.
    if (startDate?.length && endDate?.length)
      matchPhase.$match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };

    if (plan) matchPhase.$match.plan = new Types.ObjectId(plan);
    else matchPhase.$match.plan = null;

    const expenses = await (<IExpense[]>(
      (<unknown>(
        Expense.aggregate([matchPhase, lookupPhase, unwindPhase, sortPhase])
      ))
    ));
    res.json({ message: "List Retrieved.", response: expenses });
  }
);
