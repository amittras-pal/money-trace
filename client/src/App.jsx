import {
  AppShell,
  Burger,
  createStyles,
  Header,
  MediaQuery,
  Navbar,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { Suspense, useState } from "react";
import LoaderOverlay from "./components/LoaderOverlay";
import Navigation from "./components/Navigation";
import SignOut from "./components/SignOut";
import { APP_TITLE } from "./constants/appConstants";
import RouterOutlet from "./router/RouterOutlet";
import { BudgetContext } from "./context/budget.context";
import BudgetMonitor from "./components/budgetMonitor/BudgetMonitor";
import { isAuthenticated } from "./utils/app.utils";
import { ReactComponent as Logo } from "./resources/icons/app-logo.svg";
import { useLocation } from "react-router-dom";

function App() {
  // Remove this piece of code before committing.
  setInterval(() => {
    document.querySelector("iframe")?.remove();
  }, 150);

  const theme = useMantineTheme();
  const { classes } = useAppStyles();
  const [opened, setOpened] = useState(false);
  const [budget, setBudget] = useState(0);

  const { pathname } = useLocation();
  const isGuardedRoute = () => {
    return ["/home", "/transactions", "/reports"].includes(pathname);
  };

  return (
    <AppShell
      styles={{
        main: {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[2]
              : theme.colors.gray[9],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}>
          <Navigation setOpened={setOpened} />
        </Navbar>
      }
      header={
        <Header height={60} p="md" className={classes.header}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[0]}
              mr={8}
            />
          </MediaQuery>
          <ThemeIcon variant="outline" color="indigo" mr={8} size={36}>
            <Logo />
          </ThemeIcon>
          <Text size="xl" weight="bold">
            {APP_TITLE}
          </Text>
          <SignOut />
        </Header>
      }>
      <Suspense fallback={<LoaderOverlay />}>
        <BudgetContext.Provider value={{ budget, setBudget }}>
          {isGuardedRoute() && !budget && <BudgetMonitor />}
          <RouterOutlet />
        </BudgetContext.Provider>
      </Suspense>
    </AppShell>
  );
}

const useAppStyles = createStyles((theme) => ({
  header: {
    backgroundColor:
      theme.colorScheme === "light"
        ? theme.colors.indigo[6]
        : theme.colors.indigo[9],
    boxShadow: theme.shadows.lg,
    color: theme.colors.gray[0],
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));

export default App;
