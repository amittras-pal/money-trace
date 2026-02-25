import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { recurringExpenseMessages } from "../constants/apimessages";
import RecurringExpense from "../models/recurringExpense.model";
import { IRecurringExpense } from "../types/recurringExpense";
import { TypedRequest, TypedResponse } from "../types/requests";
import { processRecurringExpenses } from "../utils/recurringExpenseProcessor";

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * @description Create a new recurring expense rule.
 * @method POST /api/recurring-expenses
 * @access protected (authenticate)
 */
export const createRecurringExpense = routeHandler(
  async (req: TypedRequest<{}, IRecurringExpense>, res: TypedResponse) => {
    const { userId } = req;
    const { title, categoryId, dayOfMonth } = req.body;

    if (!title || !categoryId || !dayOfMonth) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    const rule = new RecurringExpense({
      ...req.body,
      user: userId,
    });
    await rule.save();

    res.status(StatusCodes.CREATED).json({
      message: recurringExpenseMessages.created,
    });
  },
);

/**
 * @description List all recurring expense rules for the logged-in user.
 * @method GET /api/recurring-expenses
 * @access protected (authenticate)
 */
export const listRecurringExpenses = routeHandler(
  async (req: TypedRequest, res: TypedResponse<IRecurringExpense[]>) => {
    const rules = await RecurringExpense.find({
      user: new Types.ObjectId(req.userId),
    })
      .populate("category")
      .sort({ dayOfMonth: 1 });

    res.json({
      message: recurringExpenseMessages.listRetrieved,
      response: rules as any,
    });
  },
);

/**
 * @description Update a recurring expense rule.
 * @method PUT /api/recurring-expenses
 * @access protected (authenticate)
 */
export const updateRecurringExpense = routeHandler(
  async (req: TypedRequest<{}, IRecurringExpense>, res: TypedResponse) => {
    const { _id, title, categoryId, dayOfMonth } = req.body;

    if (!_id || !title || !categoryId || !dayOfMonth) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    await RecurringExpense.findOneAndUpdate(
      { _id, user: new Types.ObjectId(req.userId) },
      { $set: req.body },
    );

    res.json({ message: recurringExpenseMessages.updated });
  },
);

/**
 * @description Delete a recurring expense rule.
 * @method DELETE /api/recurring-expenses?id=<id>
 * @access protected (authenticate)
 */
export const deleteRecurringExpense = routeHandler(
  async (req: TypedRequest<{ id: string }>, res: TypedResponse) => {
    await RecurringExpense.findOneAndDelete({
      _id: req.query.id,
      user: new Types.ObjectId(req.userId),
    });

    res.json({ message: recurringExpenseMessages.deleted });
  },
);

// ---------------------------------------------------------------------------
// Processing – user-scoped (authenticate)
// ---------------------------------------------------------------------------

/**
 * @description Process due recurring expenses for the logged-in user.
 *              Idempotent: safe to call multiple times in the same month.
 * @method POST /api/recurring-expenses/process
 * @access protected (authenticate)
 */
export const processDueForUser = routeHandler(
  async (req: TypedRequest, res: TypedResponse) => {
    const count = await processRecurringExpenses({
      user: new Types.ObjectId(req.userId),
    });

    res.json({
      message: recurringExpenseMessages.processed(count),
    });
  },
);

// ---------------------------------------------------------------------------
// Processing – global (systemGate)
// ---------------------------------------------------------------------------

/**
 * @description Process due recurring expenses for ALL users.
 *              Intended to be called by an external scheduler / Atlas trigger / admin.
 * @method POST /api/recurring-expenses/process-all
 * @access protected (systemGate)
 */
export const processDueForAllUsers = routeHandler(
  async (_req: TypedRequest, res: TypedResponse) => {
    const count = await processRecurringExpenses({});

    res.json({
      message: recurringExpenseMessages.processed(count),
    });
  },
);
