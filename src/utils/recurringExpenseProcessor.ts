import Expense from "../models/expense.model";
import RecurringExpense from "../models/recurringExpense.model";

/**
 * Find due recurring expenses matching the given filter and create
 * corresponding expense documents. Idempotent within a calendar month.
 *
 * @param filter – Mongoose filter merged into the RecurringExpense query.
 * @returns count of expenses created.
 */
export async function processRecurringExpenses(
  filter: Record<string, any>,
): Promise<number> {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const due = await RecurringExpense.find({
    ...filter,
    active: true,
    dayOfMonth: { $lte: today.getDate() },
    $or: [
      { lastCreatedMonth: { $ne: month } },
      { lastCreatedYear: { $ne: year } },
    ],
  });

  if (due.length === 0) return 0;

  const expenses = due.map((r) => ({
    title: r.title,
    description: r.description,
    date: today,
    categoryId: r.categoryId,
    user: r.user,
    amount: r.amount,
    reverted: false,
    linked: null,
    plan: null,
    auto: true,
  }));

  await Expense.insertMany(expenses);

  await RecurringExpense.updateMany(
    { _id: { $in: due.map((d) => d._id) } },
    {
      $set: {
        lastCreatedMonth: month,
        lastCreatedYear: year,
        lastProcessedAt: today,
      },
    },
  );

  return expenses.length;
}
