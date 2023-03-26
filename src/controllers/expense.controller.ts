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
    const { title, amount, date, category, subCategory }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!title || !amount || !date || !category || !subCategory) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    const expense = new Expense({ ...ex, user: userId });
    await expense.save();

    res.json({ message: "Expense saved successfully." });
  }
);

/**
 * Save a new expense.
 * @description get expenses of a user
 * @method PUT /api/expenses
 * @access protected
 */
export const updateExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { title, amount, date, category, subCategory, _id }: IExpense =
      req.body;
    const ex: IExpense = req.body;

    if (!_id || !title || !amount || !date || !category || !subCategory) {
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
    res: TypedResponse<{ summary: Array<any>; total: number }>
  ) => {
    const { firstDay, lastDay } = req.query;

    /**
     * Aggregation pipeline
     * #1 find in 'expenses' collection
     *    > unreverted expenses by the current user
     *    > which are not part of an expense plan
     *    > created between the first and last of the current month
     */
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
          _id: "$category",
          spent: { $sum: "$amount" },
          subCategories: { $addToSet: "$subCategory" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      message: "Summary for the current month retrieved successfully.",
      response: {
        summary,
        total: summary.reduce((sum, curr) => sum + curr.spent, 0),
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

type ListingParams = {
  filter: {
    startDate: string;
    endDate: string;
    categories?: string[];
  };
  sort?: {
    date?: 1 | -1;
    amount?: 1 | -1;
  };
  paginate?: {
    page: number;
    size: number;
  };
};

export const listing = routeHandler(
  async (req: TypedRequest<{}, ListingParams>, res: TypedResponse<any[]>) => {
    const { filter, paginate, sort } = req.body;

    const matching: PipelineStage.Match = {
      $match: {
        user: new Types.ObjectId(req.userId),
        plan: null, // TODO: add matching with expense plans too.
        date: {
          $gte: new Date(filter.startDate),
          $lte: new Date(filter.endDate),
        },
      },
    };

    if (filter.categories?.length) {
      matching.$match.category = {
        $in: filter.categories,
      };
    }

    const sorting: PipelineStage.Sort = {
      $sort: sort ? sort : { date: -1 },
    };

    const dataFacet: (
      | PipelineStage.Match
      | PipelineStage.Sort
      | PipelineStage.Skip
      | PipelineStage.Limit
    )[] = [matching, sorting];

    if (paginate)
      dataFacet.push(
        { $skip: paginate.page * paginate.size },
        { $limit: paginate.size }
      );

    const expenses = await Expense.aggregate([
      {
        $facet: {
          data: dataFacet,
          meta: [
            matching,
            { $count: "totalDocuments" },
            {
              $addFields: {
                ...paginate,
                totalPages: {
                  $ceil: { $divide: ["$totalDocuments", paginate?.size] },
                },
              },
            },
          ],
        },
      },
      { $unwind: "$meta" },
    ]);

    res.json({
      message: "List Retrieved",
      response: expenses[0],
    });
  }
);
