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
    label: "Planned Reports",
    path: "/planned-reports",
    exactMatch: false,
  },
];
