import {
  IconArrowsDoubleSwNe,
  IconDashboard,
  IconReport,
} from "@tabler/icons-react";

export const ROUTES = [
  {
    icon: <IconDashboard size={16} />,
    label: "Dashboard",
    path: "/",
    exactMatch: true,
  },
  {
    icon: <IconArrowsDoubleSwNe size={16} />,
    label: "Transactions List",
    path: "/expenses",
    exactMatch: true,
  },
  {
    icon: <IconReport size={16} />,
    label: "Vacations & Plans",
    path: "/plans",
    exactMatch: false,
  },
];
