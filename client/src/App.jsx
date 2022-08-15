import {
  Box,
  Button,
  createStyles,
  Header,
  Image,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Suspense, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartInfographic } from "tabler-icons-react";
import BudgetMonitor from "./components/budgetMonitor/BudgetMonitor";
import LoaderOverlay from "./components/LoaderOverlay";
import SignOut from "./components/SignOut";
import { APP_TITLE } from "./constants/appConstants";
import { BudgetContext } from "./context/budget.context";
import logo from "./resources/icons/app-logo.svg";
import RouterOutlet from "./router/RouterOutlet";

function App() {
  // Remove this piece of code before committing.
  setInterval(() => {
    document.querySelector("iframe")?.remove();
  }, 150);

  const theme = useMantineTheme();
  const { classes } = useAppStyles();
  const [budget, setBudget] = useState(0);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const { pathname } = useLocation();
  const isGuardedRoute = () => {
    return ["/home", "/transactions", "/reports"].includes(pathname);
  };

  return (
    <>
      <Box
        spacing={0}
        sx={() => ({
          display: "flex",
          height: "100vh",
          width: "100vw",
          flexDirection: "column",
        })}>
        <Header height={60} p="md" className={classes.header}>
          <ThemeIcon color="gray" mr={8} size={28}>
            <Image src={logo} />
          </ThemeIcon>
          <Text component={Link} to="/home" size="lg" weight="bold" mr="auto">
            {APP_TITLE}
          </Text>
          <Button
            component={Link}
            to="/reports"
            size="xs"
            mr="sm"
            leftIcon={<ChartInfographic size={18} />}
            color="indigo"
            variant="light"
            radius="xl">
            Reports
          </Button>
          <SignOut />
        </Header>
        {isMobile ? (
          <Box p="sm" style={{ height: "100%", flexGrow: 1 }}>
            <Suspense fallback={<LoaderOverlay />}>
              <BudgetContext.Provider value={{ budget, setBudget }}>
                {isGuardedRoute() && !budget && <BudgetMonitor />}
                <RouterOutlet />
              </BudgetContext.Provider>
            </Suspense>
          </Box>
        ) : (
          <Box>
            We don't support desktop view, this application is supposed to be
            used on a mobile device.
          </Box>
        )}
      </Box>
    </>
  );
}

const useAppStyles = createStyles((theme) => ({
  header: {
    backgroundColor:
      theme.colorScheme === "light"
        ? theme.colors.gray[6]
        : theme.colors.gray[8],
    boxShadow: theme.shadows.lg,
    color: theme.colors.gray[0],
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
}));

export default App;
