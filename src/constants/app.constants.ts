import { ICategory } from "../types/category";

export const defaultBudget: ICategory[] = [
  {
    title: "Food",
    amount: 2000,
    managed: true,
    color: "#000000",
    description:
      "Use to record everything from groceries, snacks, meals or any other edible items.",
  },
  {
    title: "Medical",
    amount: 2000,
    managed: false,
    color: "#000000",
    description: "Any kind of medical expense.",
  },
  {
    title: "Personal",
    amount: 2000,
    managed: true,
    color: "#000000",
    description: "Haircuts, cosmetics, other personal needs.",
  },
  {
    title: "Shopping",
    amount: 2000,
    managed: true,
    color: "#000000",
    description:
      "Online or otherwise which doesn’t come under the other purchase categories. Mostly dealing with lasting material goods.",
  },
  {
    title: "Transport",
    amount: 2000,
    managed: true,
    color: "#000000",
    description:
      "Includes all kinds of travel like public transport, cabs, long distance travel etc.",
  },
  {
    title: "Utilities",
    amount: 2000,
    managed: true,
    color: "#000000",
    description:
      "House rent, phone/internet bills, electricity, household items like toiletries etc.",
  },
];
