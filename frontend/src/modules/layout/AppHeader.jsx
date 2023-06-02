import {
  ActionIcon,
  Burger,
  Header,
  Image,
  MediaQuery,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import { useAppStyles } from "./styles";
import logo from "../../resources/app-logo.svg";
import { IconLogout, IconPower } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";

export default function AppHeader({ open, setOpen }) {
  const { classes } = useAppStyles();
  const theme = useMantineTheme();
  const client = useQueryClient();
  const navigate = useNavigate();

  const confirmLogout = () =>
    modals.openConfirmModal({
      centered: true,
      title: "Confirm Logout",
      children: <Text color="red">Are you sure you want to logout?</Text>,
      withCloseButton: false,
      closeOnCancel: true,
      labels: {
        confirm: "Yes",
        cancel: "No",
      },
      confirmProps: {
        variant: "filled",
        color: "red",
        leftIcon: <IconLogout />,
      },
      onConfirm: () => {
        localStorage.clear();
        client.clear();
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
      },
    });

  return (
    <Header height={60} className={classes.header}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={open}
          onClick={() => setOpen((o) => !o)}
          size="sm"
          color={theme.colors.gray[6]}
          mr="md"
        />
      </MediaQuery>
      <ThemeIcon
        color="gray"
        mr={8}
        size={28}
        variant="outline"
        sx={(theme) => ({ borderColor: theme.colors.dark[4] })}
      >
        <Image src={logo} />
      </ThemeIcon>
      <Text fz="lg" fw="bold" component={Link} to="/">
        {APP_TITLE}
      </Text>
      <ActionIcon
        ml="auto"
        size="md"
        variant="subtle"
        color="red"
        onClick={confirmLogout}
      >
        <IconPower size={18} />
      </ActionIcon>
    </Header>
  );
}
