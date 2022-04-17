import {
  Car,
  Coffee,
  Recharging,
  ShoppingCart,
  Stethoscope,
  User,
} from "tabler-icons-react";

export const APP_TITLE = "Expense Tracker";
export const MONTHLY_BUDGET = 25000;
export const CATEGORIES = {
  Food: { icon: Coffee, color: "green" },
  Medical: { icon: Stethoscope, color: "red" },
  Personal: { icon: User, color: "blue" },
  Shopping: { icon: ShoppingCart, color: "violet" },
  Transport: { icon: Car, color: "yellow" },
  Utilities: { icon: Recharging, color: "orange" },
};
