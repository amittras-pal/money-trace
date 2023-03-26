import { model, Schema } from "mongoose";
import { ICategory } from "../types/category";

const categorySchema = new Schema<ICategory>({
  title: { type: "string", required: true, trim: true },
  amount: { type: "number", required: true, default: 0 },
  color: { type: "string", required: true },
  managed: { type: "boolean", required: true, default: true },
  description: { type: "string", maxlength: 120 },
});

const Category = model("Category", categorySchema);
export default Category;
