import routeHandler from "express-async-handler";
import { categoryMessages } from "../constants/apimessages";
import Category from "../models/category.model";
import { ICategory } from "../types/category";
import { TypedRequest, TypedResponse } from "../types/requests";

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
