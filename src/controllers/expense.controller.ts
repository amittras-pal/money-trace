import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { expenseMessages } from "../constants/apimessages";
import Expense from "../models/expense.model";
import ExpensePlan from "../models/expensePlan.model";
import { IExpense } from "../types/expense";
import { TypedRequest, TypedResponse } from "../types/requests";
import {
  IListReqBody,
  ISearchReqBody,
  ISummaryReqParams,
} from "../types/utility";
import {
  SummaryAggregator,
  listAggregator,
  searchAggregator,
} from "../utils/aggregators";

/**
 * @description Save a new expense.
 * @method POST /api/expenses
 * @access protected
 */
export const createExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { userId } = req;
    const { title, date, categoryId }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!title || !date || !categoryId) {
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

    res.json({ message: expenseMessages.expenseSavedSuccessfully });
  }
);

/**
 * @description Updates expense and any linked expense as well.
 * @method PUT /api/expenses
 * @access protected
 */
export const updateExpense = routeHandler(
  async (
    req: TypedRequest<{}, IExpense>,
    res: TypedResponse<IExpense | null>
  ) => {
    const { title, date, categoryId, _id }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!_id || !title || !date || !categoryId) {
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

    res.json({
      message: expenseMessages.expenseUpdatedSuccessfully,
      response: update,
    });
  }
);

/**
 * @description Delete a single expense by a user, also deletes linked expense, if any
 * @method DELETE /api/expenses
 * @access protected
 */
export const deleteExpense = routeHandler(
  async (req: TypedRequest<{ id: "string" }, {}>, res: TypedResponse) => {
    const expense: IExpense | null = await Expense.findById(req.query.id);

    // When a linked expense is deleted, break the link.
    if (expense?.linked) {
      await Expense.findByIdAndUpdate(
        {
          user: new Types.ObjectId(req.userId),
          _id: new Types.ObjectId(expense.linked),
        },
        { $set: { linked: null } }
      );
    }

    // delete original
    await Expense.deleteOne({
      user: new Types.ObjectId(req.userId),
      _id: new Types.ObjectId(req.query.id),
    });

    res.json({ message: expenseMessages.expenseDeletedSuccessfully });
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
    req: TypedRequest<ISummaryReqParams, {}>,
    res: TypedResponse<{ summary: Array<any>; total: Number }>
  ) => {
    const query = SummaryAggregator(req.query, req.userId ?? "");
    // Create a type for this response.
    const summary = await Expense.aggregate(query);

    res.json({
      message: expenseMessages.summaryForTheCurrentMonthRetrievedSuccessfully,
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
    req: TypedRequest<{}, IListReqBody>,
    res: TypedResponse<IExpense[]>
  ) => {
    const query = listAggregator(req.body, req.userId ?? "");
    const expenses = await (<IExpense[]>(<unknown>Expense.aggregate(query)));
    res.json({ message: expenseMessages.listRetrieved, response: expenses });
  }
);

/**
 * @description Implements a global search for all expenses.
 * @method POST /api/expenses/search
 * @access protected
 */
export const searchExpense = routeHandler(
  async (req: TypedRequest<{}, ISearchReqBody>, res: TypedResponse) => {
    const query = searchAggregator(req.body, req.userId ?? "");
    const expenses = await (<IExpense[]>(<unknown>Expense.aggregate(query)));
    res.json({
      message: expenseMessages.resultsRetrieved,
      response: expenses,
    });
  }
);
