import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId | string;
  label: string;
  group: string;
  color: string;
  icon: string;
  description?: string;
}
