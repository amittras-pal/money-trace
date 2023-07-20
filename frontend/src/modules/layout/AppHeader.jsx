import {
  ActionIcon,
  Burger,
  Header,
  Image,
  MediaQuery,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronRight, IconLogout, IconPower } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import logo from "../../resources/app-logo.svg";
import { useAppStyles } from "./styles";
import { useMediaMatch } from "../../hooks/useMediaMatch";

export default function AppHeader({ open, setOpen }) {
  const { classes } = useAppStyles();
  const theme = useMantineTheme();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState([APP_TITLE, ""]);
  const isMobile = useMediaMatch();

  const titleHandler = useCallback((entries) => {
    const title = entries[0]?.addedNodes?.[0]?.data
      ?.split("|")
      .map((segment) => segment.trim());
    setTitle(title);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(titleHandler);
    observer.observe(document.querySelector("title"), {
      childList: true,
      subtree: false,
    });
    return () => {
      observer.disconnect();
    };
  }, [titleHandler]);

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
      <Text
        fz="lg"
        fw="bold"
        mr={4}
        component={Link}
        to="/"
        sx={{ whiteSpace: "nowrap" }}
      >
        {title[0]} <IconChevronRight size={14} />
      </Text>
      <Tooltip
        label={title[1]}
        disabled={!isMobile}
        color="dark"
        events={{ touch: true }}
      >
        <Text fz="sm" fw={400} color="dimmed" lineClamp={1}>
          {title[1]}
        </Text>
      </Tooltip>
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
