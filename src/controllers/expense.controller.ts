import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { PipelineStage, Types } from "mongoose";
import Expense from "../models/expense.model";
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
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { title, amount, date, categoryId, _id }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!_id || !title || !amount || !date || !categoryId) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    await Expense.findByIdAndUpdate(_id, { $set: ex });
    res.json({ message: "Expense updated successfully." });
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
    req: TypedRequest<{ firstDay: string; lastDay: string }, {}>,
    res: TypedResponse<{ summary: Array<any>; total: Number }>
  ) => {
    const { firstDay, lastDay } = req.query;
    const summary = await Expense.aggregate([
      {
        $match: {
          user: new Types.ObjectId(req.userId),
          plan: null,
          reverted: false,
          date: {
            $gte: new Date(firstDay),
            $lte: new Date(lastDay),
          },
        },
      },
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
 * Delete expense
 * @description Delete a single expense by a user
 * @method DELETE /api/expenses
 * @access protected
 */
export const deleteExpense = routeHandler(
  async (req: TypedRequest<{ id: "string" }, {}>, res: TypedResponse) => {
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
 * @description Get a list of expenses for a date range.
 * @method POST /api/expenses
 * @access protected
 */
export const listExpenses = routeHandler(
  async (
    req: TypedRequest<
      {},
      {
        startDate: string;
        endDate: string;
        plan: string;
        sort: Record<string, 1 | -1>;
      }
    >,
    res: TypedResponse<IExpense[]>
  ) => {
    const { startDate = "", endDate = "", plan = null, sort } = req.body;

    const matchPhase: PipelineStage.Match = {
      $match: {
        user: new Types.ObjectId(req.userId),
        plan: plan,
      },
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

    if (startDate && endDate)
      matchPhase.$match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };

    const expenses = await (<IExpense[]>(
      (<unknown>(
        Expense.aggregate([matchPhase, lookupPhase, unwindPhase, sortPhase])
      ))
    ));
    res.json({ message: "List Retrieved.", response: expenses });
  }
);
