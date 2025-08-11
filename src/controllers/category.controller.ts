import routeHandler from "express-async-handler";
import { categoryMessages } from "../constants/apimessages";
import Category from "../models/category.model";
import { ICategory } from "../types/category";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description Retrieve list of categories
 * @method GET /api/categories/get-all
 * @access protected
 */
export const getCategories = routeHandler(
  async (_req: TypedRequest<{}, {}>, res: TypedResponse<ICategory[]>) => {
    const categories: ICategory[] = await Category.find({}).sort({
      group: 1,
      label: 1,
    });
    res.json({
      message: categoryMessages.categoriesRetrieved,
      response: categories,
    });
  }
);

/**
 * @description Retrieve list of top level category families along with their color and number of children
 * @method GET /api/categories/get-groups
 * @access protected
 */
export const getCategoryGroups = routeHandler(
  async (_req: TypedRequest, res: TypedResponse) => {
    const groups = await Category.aggregate([
      {
        $group: {
          _id: "$group",
          color: { $first: "$color" },
          subCategories: { $count: {} },
        },
      },
      {
        $project: {
          _id: false,
          name: "$_id",
          color: true,
          subCategories: true,
        },
      },
    ]);
    res.json({
      message: "Category Groups Loaded",
      response: groups,
    });
  }
);
