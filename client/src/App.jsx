import {
  AppShell,
  Burger,
  createStyles,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Suspense, useState } from "react";
import LoaderOverlay from "./components/LoaderOverlay";
import Navigation from "./components/Navigation";
import SignOut from "./components/SignOut";
import { APP_TITLE } from "./constants/appConstants";
import RouterOutlet from "./router/RouterOutlet";

function App() {
  // Remove this piece of code before committing.
  setInterval(() => {
    document.querySelector("iframe")?.remove();
  }, 150);

  const theme = useMantineTheme();
  const { classes } = useAppStyles();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          backgroundColor: theme.colors.gray[2],
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
              mr="xl"
            />
          </MediaQuery>
          <Text size="xl" weight="bold">
            {APP_TITLE}
          </Text>
          <SignOut />
        </Header>
      }>
      <Suspense fallback={<LoaderOverlay />}>
        <RouterOutlet />
      </Suspense>
    </AppShell>
  );
}

const useAppStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.indigo[6],
    boxShadow: theme.shadows.lg,
    color: theme.colors.gray[0],
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));

export default App;
