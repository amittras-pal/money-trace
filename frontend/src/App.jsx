import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import AppHeader from "./components/layout/header/AppHeader";
import AppNavigation from "./components/layout/navigation/AppNavigation";
import RouterOutlet from "./components/router/RouterOutlet";
import { UserProvider } from "./context/UserContext";
import ChangeLog from "./views/changeLog/ChangeLog";

export default function App() {
  const { colors, colorScheme } = useMantineTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <UserProvider>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        styles={{
          main: {
            background:
              colorScheme === "dark" ? colors.dark[8] : colors.gray[0],
          },
        }}
        navbar={<AppNavigation opened={drawerOpen} setOpened={setDrawerOpen} />}
        header={<AppHeader opened={drawerOpen} setOpened={setDrawerOpen} />}>
        <RouterOutlet />
        <ChangeLog />
      </AppShell>
    </UserProvider>
  );
}
