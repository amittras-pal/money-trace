import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Budget from "../models/budget.model";
import { IBudget } from "../types/budget";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method is used to create the budget for a given month and year for a user
 * @method POST /api/budget
 * @access protected
 */
export const createBudget = routeHandler(
  async (req: TypedRequest<{}, Partial<IBudget>>, res: TypedResponse) => {
    const { userId } = req;
    const { month, year, amount } = req.body;
    await Budget.create({
      user: userId,
      month,
      year,
      amount,
    });
    res.status(StatusCodes.OK).json({ message: "Budget created successfully" });
  }
);

/**
 * @description Retrieve the budget by month & year
 * @method GET /api/budget
 * @access protected
 */
export const getBudget = routeHandler(
  async (
    req: TypedRequest<{ month: string; year: string }, {}>,
    res: TypedResponse<IBudget>
  ) => {
    const { month, year } = req.query;
    if (month === undefined || year === undefined) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Required params are not provided.");
    }

    const budget: IBudget | null = await Budget.findOne({
      user: req.userId,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!budget) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Budget not found");
    }

    res.json({
      message: "Budget retrieved successfully",
      response: budget,
    });
  }
);

/**
 * @description Update the provided budget
 * @method PUT /api/budget
 * @access protected
 */
// export const updateBudget = routeHandler(
//   async (
//     req: TypedRequest<{}, IBudget>,
//     res: TypedResponse<
//       | (Document<unknown, any, IBudget> &
//           IBudget &
//           Required<{
//             _id: Types.ObjectId;
//           }>)
//       | null
//     >
//   ) => {
//     const { categories } = req.body;
//     const existing = await Budget.findById(req.body._id).populate("categories");
//     const budgetCategories: (string | undefined)[] =
//       existing?.categories?.map((cat) => cat._id?.toString()) || [];

//     // Update modified categories...
//     const updated =
//       categories?.filter((cat: CategoryOps) => cat.operation === "updated") ??
//       [];
//     if (updated.length > 0)
//       await Promise.all(
//         updated?.map((cat) => {
//           const id = cat._id?.toString();
//           delete cat._id;
//           return Category.findByIdAndUpdate(id, cat);
//         })
//       );

//     // Add New Categories... And update new IDs array
//     const added =
//       categories?.filter((cat: CategoryOps) => cat.operation === "added") ?? [];
//     if (added?.length > 0) {
//       const result = await Category.insertMany(added);
//       budgetCategories.push(...(result.map((cat) => cat._id.toString()) ?? []));
//     }

//     // Remove deleted categories... And update new IDs array
//     const removed =
//       categories?.filter((cat: CategoryOps) => cat.operation === "removed") ??
//       [];
//     if (removed.length > 0) {
//       removed.forEach((remCat) => {
//         const loc = budgetCategories.findIndex(
//           (id) => id === remCat._id?.toString()
//         );
//         budgetCategories.splice(loc, 1);
//       });
//       await Category.deleteMany({
//         _id: {
//           $in: removed.map((c) => c._id),
//         },
//       });
//     }

//     const updatedBudget = await Budget.findOneAndUpdate(
//       { _id: req.body._id },
//       {
//         $set: {
//           categories: budgetCategories,
//         },
//       },
//       { new: true }
//     ).populate("categories");

//     res.json({
//       message: "Budget Updated Successfully.",
//       response: updatedBudget,
//     });
//   }
// );
