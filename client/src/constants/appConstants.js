import {
  Car,
  Coffee,
  Recharging,
  ShoppingCart,
  Stethoscope,
  User,
} from "tabler-icons-react";

export const APP_TITLE = "Money Trace";
export const CATEGORIES = {
  Food: {
    icon: Coffee,
    color: "green",
    description:
      "Includes everything from groceries, snacks, meals or any other edible items etc.",
  },
  Medical: {
    icon: Stethoscope,
    color: "red",
    description: "Any kind of medical expense",
  },
  Personal: {
    icon: User,
    color: "blue",
    description: "Haircuts, cosmetics, other personal needs.",
  },
  Shopping: {
    icon: ShoppingCart,
    color: "violet",
    description:
      "Online or otherwise which doesn’t come under the other purchase categories. Mostly dealing with lasting material goods.",
  },
  Transport: {
    icon: Car,
    color: "yellow",
    description:
      "Includes all kinds of travel like public transport, cabs, long distance travel etc.",
  },
  Utilities: {
    icon: Recharging,
    color: "orange",
    description:
      "House rent, phone/internet bills, electricity, household items like toiletries etc.",
  },
};
