import { IconArrowsDoubleSwNe, IconDashboard, IconReport } from "@tabler/icons";

export const APP_TITLE = "Money Trace";
export const APP_VERSION = "v2.0.0";
export const NAV_ROUTES = [
  {
    icon: <IconDashboard size={16} />,
    label: "Dashboard",
    path: "/",
    exactMatch: true,
  },
  {
    icon: <IconArrowsDoubleSwNe size={16} />,
    label: "Transactions List",
    path: "/transactions",
    exactMatch: true,
  },
  {
    icon: <IconReport size={16} />,
    label: "Expense Plans",
    path: "/planned-reports",
    exactMatch: false,
  },
];

export const CATEGORIES = {
  Food: {
    color: "green",
    description:
      "Includes everything from groceries, snacks, meals or any other edible items etc.",
  },
  Medical: {
    color: "red",
    description: "Any kind of medical expense",
  },
  Personal: {
    color: "grape",
    description: "Haircuts, cosmetics, other personal needs.",
  },
  Shopping: {
    color: "violet",
    description:
      "Online or otherwise which doesn’t come under the other purchase categories. Mostly dealing with lasting material goods.",
  },
  Transport: {
    color: "yellow",
    description:
      "Includes all kinds of travel like public transport, cabs, long distance travel etc.",
  },
  Utilities: {
    color: "cyan",
    description:
      "House rent, phone/internet bills, electricity, household items like toiletries etc.",
  },
};

export const DASHBOARD_QUERIES = [
  ["expense-summary", new Date().getMonth() + 1, new Date().getFullYear()],
  "last-two-days",
];
