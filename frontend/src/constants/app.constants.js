import { IconArrowsDoubleSwNe, IconDashboard, IconReport } from "@tabler/icons";
import dayjs from "dayjs";

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
  ["expense-summary", dayjs().month() + 1, dayjs().year()],
  "last-two-days",
];

export const MONTHS = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Apr", value: 3 },
  { label: "May", value: 4 },
  { label: "Jun", value: 5 },
  { label: "Jul", value: 6 },
  { label: "Aug", value: 7 },
  { label: "Sep", value: 8 },
  { label: "Oct", value: 9 },
  { label: "Nov", value: 10 },
  { label: "Dec", value: 11 },
];
