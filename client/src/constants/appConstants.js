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
  Transport: { icon: Car, color: "yellow" },
  Utilities: { icon: Recharging, color: "orange" },
  Shopping: { icon: ShoppingCart, color: "violet" },
  Personal: { icon: User, color: "blue" },
  Medical: { icon: Stethoscope, color: "red" },
};
