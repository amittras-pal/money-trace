import * as yup from "yup";

export const expensePlanSchema = yup.object().shape({
  name: yup
    .string()
    .required("Plan name is required.")
    .max(40, "Plan name can't exceed 40 characters."),
  description: yup
    .string()
    .required("Plan description is required.")
    .max(400, "Plan description can't exceed 400 characters.")
    .min(20, "Plan description should be 20 characters or longer"),
});
