import {
  Box,
  createStyles,
  Group,
  Image,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { ArrowsDoubleNeSw, Home, Report } from "tabler-icons-react";
import shieldImage from "../resources/illustrations/Unauthorized.svg";
import { isAuthenticated } from "../utils/app.utils";

const menuButtons = [
  { label: "Home", icon: <Home size={20} />, path: "/home" },
  {
    label: "Transactions",
    icon: <ArrowsDoubleNeSw size={20} />,
    path: "/transactions",
  },
  { label: "Reports", icon: <Report size={20} />, path: "/reports" },
  // { label: "User", icon: <User size={20} />, path: "/user" },
];

const useNavigationStyles = createStyles((theme) => ({
  navButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[theme.colorScheme === "light" ? 0 : 9],
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    textDecoration: "none",
    color: theme.colors.gray[theme.colorScheme === "light" ? 8 : 5],
    transition: "all o.25s ease-in-out",
    "&:hover": {
      backgroundColor: theme.colors.gray[theme.colorScheme === "light" ? 3 : 7],
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
  const { pathname } = useLocation();

  if (!isAuthenticated()) {
    return (
      <Group direction="column" position="center" className={classes.locked}>
        <Image src={shieldImage} />
        <Text size="sm" color="dimmed" align="center">
          Please login to access navigation.
        </Text>
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
          <ThemeIcon
            size={30}
            variant={pathname.includes(item.path) ? "light" : "filled"}
            color="indigo">
            {item.icon}
          </ThemeIcon>
          <Text weight="bold">{item.label}</Text>
        </Box>
      ))}
    </Group>
  );
}

export default Navigation;
