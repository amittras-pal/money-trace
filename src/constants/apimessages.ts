export const appInfoMessages: Record<string, string> = {
  releaseRetrieved: "Releases Retrieved",
  contributorDetailsRetrieved: "Contributor Details Retrieved",
};

export const budgetMessages: Record<string, string> = {
  budgetCreatedSuccessfully: "Budget created successfully",
  budgetRetrievedSuccessfully: "Budget retrieved successfully",
};

export const categoryMessages: Record<string, string> = {
  categoriesRetrieved: "Categories Retrieved",
};

export const expenseMessages: Record<string, string> = {
  expenseSavedSuccessfully: "Expense saved successfully.",
  expenseUpdatedSuccessfully: "Expense updated successfully.",
  expenseDeletedSuccessfully: "Expense deleted successfully.",
  summaryForTheCurrentMonthRetrievedSuccessfully:
    "Summary for the current month retrieved successfully.",
  listRetrieved: "List Retrieved.",
  resultsRetrieved: "Results retrieved.",
};

export const expensePlanMessages: Record<string, string> = {
  expensePlanCreatedSuccessfully: "Expense plan created successfully",
  somethingWentWrongWhileCreatingExpensePlan:
    "Something went wrong while creating expense plan",
  plansRetrieved: "Plans Retrieved",
  detailsRetrieved: "Details Retrieved",
  expensePlanUpdatedSuccessfully: "Expense plan updated successfully",
};

export const userMessages: Record<string, string> = {
  successfullyRegisterd:
    "You are successfully registerd. Please login with your new user account",
  loginSuccessful: "Login Successful!!",
  userDetailsRetrievedSuccessfully: "User Details Retrieved Successfully!",
  userDetailsUpdated: "User details updated",
  pinChangedSuccessfully: "Pin Changed Successfully!!",
};

export const recurringExpenseMessages = {
  created: "Recurring expense created successfully.",
  listRetrieved: "Recurring expenses retrieved.",
  updated: "Recurring expense updated successfully.",
  deleted: "Recurring expense deleted successfully.",
  processed: (count: number) =>
    count > 0
      ? `${count} recurring expense(s) processed.`
      : "No recurring expenses due today.",
};

export const statsMessages: Record<string, string> = {
  yearStats: "Year stats summary retried successfylly.",
  monthStats: "Month stats summary retrieved successfully.",
  rollingStats: "Rolling stats fetched successfully.",
};
