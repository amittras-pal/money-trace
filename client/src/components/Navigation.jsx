import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { Archive, Home, Lock, User } from "tabler-icons-react";
import { isAuthenticated } from "../utils/app.utils";

const menuButtons = [
  { label: "Home", icon: <Home size={20} />, path: "/home" },
  { label: "Transactions", icon: <Archive size={20} />, path: "/transactions" },
  { label: "User", icon: <User size={20} />, path: "/user" },
];

const useNavigationStyles = createStyles((theme) => ({
  navButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[0],
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    textDecoration: "none",
    color: theme.colors.gray[8],
    transition: "all o.25s ease-in-out",
    "&:hover": {
      backgroundColor: theme.colors.gray[3],
    },
  },
  navButtonActive: {
    backgroundColor: theme.colors.indigo[6],
    color: theme.colors.gray[0],
    "&:hover": {
      backgroundColor: theme.colors.indigo[6],
    },
  },
  locked: {
    justifyContent: "center",
    height: "100%",
  },
}));

function Navigation({ setOpened }) {
  const { classes, cx } = useNavigationStyles();
  const theme = useMantineTheme();
  const { pathname } = useLocation();

  if (!isAuthenticated()) {
    return (
      <Group direction="column" position="center" className={classes.locked}>
        <Text size="lg" color={theme.colors.gray[5]}>
          Please login to proceed.
        </Text>
        <Lock size={100} color={theme.colors.gray[5]} />
      </Group>
    );
  }

  return (
    <Group direction="column" spacing="sm">
      {menuButtons.map((item) => (
        <Box
          className={cx(classes.navButton, {
            [classes.navButtonActive]: pathname.includes(item.path),
          })}
          component={Link}
          onClick={() => setOpened(false)}
          to={item.path}
          key={item.path}>
          <ActionIcon
            size={30}
            variant={pathname.includes(item.path) ? "light" : "filled"}
            color="indigo">
            {item.icon}
          </ActionIcon>
          <Text weight="bold">{item.label}</Text>
        </Box>
      ))}
    </Group>
  );
}

export default Navigation;
