import { AppShell, useMantineTheme } from "@mantine/core";
import { Suspense, useState } from "react";
import CenteredLoader from "./components/centeredLoader/CenteredLoader";
import AppHeader from "./components/layout/header/AppHeader";
import AppNavigation from "./components/layout/navigation/AppNavigation";
import RouterOutlet from "./components/router/RouterOutlet";
import { UserProvider } from "./context/UserContext";
import ChangeLog from "./views/changeLog/ChangeLog";

export default function App() {
  const { colors } = useMantineTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <UserProvider>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        styles={{ main: { background: colors.dark[8] } }}
        navbar={<AppNavigation opened={drawerOpen} setOpened={setDrawerOpen} />}
        header={<AppHeader opened={drawerOpen} setOpened={setDrawerOpen} />}>
        <Suspense fallback={<CenteredLoader />}>
          <RouterOutlet />
          <ChangeLog />
        </Suspense>
      </AppShell>
    </UserProvider>
  );
}
