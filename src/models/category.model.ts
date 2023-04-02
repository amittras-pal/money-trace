import { model, Schema } from "mongoose";
import { ICategory } from "../types/category";

const categorySchema = new Schema<ICategory>({
  label: { type: "string", required: true, trim: true },
  color: { type: "string", required: true },
  group: { type: "string", required: true },
  icon: { type: "string", required: true },
  description: { type: "string", maxlength: 120 },
});

const Category = model("Category", categorySchema);
export default Category;
