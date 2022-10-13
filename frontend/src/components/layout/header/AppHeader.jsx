import {
  Burger,
  Header,
  Image,
  MediaQuery,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { APP_TITLE } from "../../../constants/app.constants";
import { useAuth } from "../../../context/UserContext";
import logo from "../../../resources/app-logo.svg";

export default function AppHeader({ opened, setOpened }) {
  const { loggedIn } = useAuth();
  const { colors } = useMantineTheme();

  return (
    <Header
      height={55}
      p="md"
      sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {loggedIn && (
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              mr="sm"
              size="sm"
              opened={opened}
              color={loggedIn ? colors.gray[4] : colors.gray[7]}
              disabled={!loggedIn}
              onClick={() => setOpened((o) => !o)}
            />
          </MediaQuery>
        )}
        <ThemeIcon
          color="gray"
          mr={8}
          size={28}
          variant="outline"
          sx={(theme) => ({ borderColor: theme.colors.dark[4] })}>
          <Image src={logo} />
        </ThemeIcon>
        <Text weight={500} color={colors.gray[4]}>
          {APP_TITLE}
        </Text>
      </div>
    </Header>
  );
}
