import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import GlobalUser from "./components/globalUser/GlobalUser";
import Navigation from "./components/router/Navigation";
import RouterOutlet from "./components/router/RouterOutlet";
import { APP_TITLE } from "./constants/app.constants";

export default function App() {
  const { colors, colorScheme } = useMantineTheme();
  // TODO: this won't be required once the navigation is moved into a drawer.
  const [opened, setOpened] = useState(false);

  // TODO: Need to move these 2 items away from here.
  const [loggedIn, setLoggedIn] = useState(null);
  useEffect(() => {
    const listener = (e) => {
      setLoggedIn(localStorage.getItem("token"));
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      styles={{
        main: {
          background: colorScheme === "dark" ? colors.dark[8] : colors.gray[0],
        },
      }}
      navbar={
        //TODO: Convert this to a drawer.
        loggedIn ? (
          <Navbar
            px="md"
            pt="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow>
              <Navigation onChange={() => setOpened(false)} />
            </Navbar.Section>
            <Navbar.Section>
              <GlobalUser />
            </Navbar.Section>
          </Navbar>
        ) : null
      }
      header={
        <Header height={60} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              {/* TODO: Find a way to move this to another component. */}
              <Burger
                mr="sm"
                size="sm"
                opened={opened}
                color={loggedIn ? colors.gray[4] : colors.gray[7]}
                disabled={!loggedIn}
                onClick={() => setOpened((o) => !o)}
              />
            </MediaQuery>
            <Text weight={500} color={colors.gray[4]}>
              {APP_TITLE}
            </Text>
          </div>
        </Header>
      }>
      <RouterOutlet />
    </AppShell>
  );
}
