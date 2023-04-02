import routeHandler from "express-async-handler";
import Category from "../models/category.model";
import { ICategory } from "../types/category";
import { TypedRequest, TypedResponse } from "../types/requests";

export const getCategories = routeHandler(
  async (_req: TypedRequest<{}, {}>, res: TypedResponse<ICategory[]>) => {
    const categories: ICategory[] = await Category.find({});
    res.json({ message: "Categories Retrieved", response: categories });
  }
);
