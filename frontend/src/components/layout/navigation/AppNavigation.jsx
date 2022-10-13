import { Navbar } from "@mantine/core";
import React from "react";
import { useAuth } from "../../../context/UserContext";
import GlobalUser from "./GlobalUser";
import Navigation from "./Navigation";

export default function AppNavigation({ opened, setOpened }) {
  const { loggedIn } = useAuth();

  if (!loggedIn) return null;

  return (
    <Navbar
      px="md"
      pt="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 240, lg: 360 }}>
      <Navbar.Section grow>
        <Navigation onChange={() => setOpened(false)} />
      </Navbar.Section>
      <Navbar.Section>
        <GlobalUser setOpened={setOpened} />
      </Navbar.Section>
    </Navbar>
  );
}
