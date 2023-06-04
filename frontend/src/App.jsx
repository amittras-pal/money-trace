import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Themer from "./components/Themer";
import UserProvider from "./context/user";
import BudgetMonitor from "./modules/budgetMonitor/BudgetMonitor";
import theme from "./theme";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={theme}
    >
      <ModalsProvider>
        <UserProvider>
          <Notifications position="top-center" autoClose={3500} />
          <BudgetMonitor />
          <Themer />
          <Suspense fallback={<LoadingOverlay visible overlayBlur={5} />}>
            <Outlet />
          </Suspense>
        </UserProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
