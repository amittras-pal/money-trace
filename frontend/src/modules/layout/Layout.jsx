import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import AuthGuard from "../guards/AuthGuard";
import { useAppStyles } from "./styles";

function AppHeader({ open, setOpen }) {
  const { classes } = useAppStyles();
  const theme = useMantineTheme();
  return (
    <Header height={50} className={classes.header}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={open}
          onClick={() => setOpen((o) => !o)}
          disabled
          size="sm"
          color={theme.colors.gray[6]}
          mr="md"
        />
      </MediaQuery>
      <Text fz="lg" fw="bold">
        {APP_TITLE}
      </Text>
    </Header>
  );
}

function AppNavigation(props) {
  const { classes } = useAppStyles();
  return (
    <Navbar
      width={{ base: 300 }}
      hiddenBreakpoint="sm"
      {...props}
      className={classes.navigation}
    ></Navbar>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard>
      <AppShell
        header={<AppHeader open={open} setOpen={setOpen} />}
        navbar={<AppNavigation hidden={!open} />}
        navbarOffsetBreakpoint="sm"
        padding="md"
      >
        <Outlet />
      </AppShell>
    </AuthGuard>
  );
}
