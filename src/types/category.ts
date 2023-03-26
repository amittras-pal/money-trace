import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId | string;
  title: string;
  amount: number;
  color: string;
  managed: boolean;
  description?: string;
}

export interface CategoryOps extends ICategory {
  operation?: "added" | "updated" | "removed";
}

export interface CategorySummary extends ICategory {
  total: number;
}
