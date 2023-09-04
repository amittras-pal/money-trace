import {
  IconArrowsDoubleSwNe,
  IconCalendarDown,
  IconDashboard,
  IconReport,
} from "@tabler/icons-react";

export const ROUTES = [
  {
    icon: <IconDashboard size={16} />,
    label: "Dashboard",
    path: "/",
    exactMatch: true,
    shortcut: "D",
  },
  {
    icon: <IconArrowsDoubleSwNe size={16} />,
    label: "Expenses List",
    path: "/expenses",
    exactMatch: true,
    shortcut: "E",
  },
  {
    icon: <IconReport size={16} />,
    label: "Vacations & Plans",
    path: "/plans",
    exactMatch: false,
    shortcut: "P",
  },
  {
    icon: <IconCalendarDown size={16} />,
    label: "Report Download",
    path: "/report",
    exactMatch: false,
    shortcut: "R",
  },
  // {
  //   icon: <IconCalendarDown size={16} />,
  //   label: "User Account",
  //   path: "/report",
  //   exactMatch: false,
  //   shortcut: "U",
  //   disabled: true,
  // },
];
