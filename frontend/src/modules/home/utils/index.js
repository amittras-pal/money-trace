import dayjs from "dayjs";
import * as yup from "yup";

export const expenseSchema = () =>
  yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .max(80, "Title can't be longer than 80 characters"),
    description: yup
      .string()
      .nullable()
      .optional()
      .max(400, "Description can't be longer than 400 characters"),
    date: yup
      .date()
      .min(
        dayjs().subtract(7, "days").toDate(),
        "Expense can't be older than 7 days."
      )
      .max(
        dayjs().add(5, "minutes").toDate(),
        "Expense can't be in the future."
      ),
    amount: yup
      .number()
      .nullable()
      .notRequired()
      .typeError("Amount has to be a number"),
    categoryId: yup.string().required("Category is required."),
    addToPlan: yup.boolean(),
    plan: yup.string().when("addToPlan", {
      is: true,
      then: () => yup.string().required("Plan is required"),
    }),
  });
