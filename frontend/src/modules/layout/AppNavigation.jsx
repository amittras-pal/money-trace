import {
  Group,
  Kbd,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { primaryColor } from "../../constants/app";
import { ROUTES } from "../../constants/routes";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import { useAppStyles } from "./styles";

export default function AppNavigation(props) {
  const { classes } = useAppStyles();
  return (
    <Navbar
      width={{ base: 300 }}
      hiddenBreakpoint="sm"
      className={classes.navigation}
      p="md"
      {...props}
    >
      <Navbar.Section grow>
        <>
          {ROUTES.map((route) => (
            <NavLink {...route} key={route.label} onChange={props.onChange} />
          ))}
        </>
      </Navbar.Section>
    </Navbar>
  );
}

const useNavBtnStyle = createStyles((theme, { active }) => ({
  navBtn: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.dark[0],
    backgroundColor: active ? theme.colors.dark[5] : "transparent",
    boxShadow: active ? theme.shadows.md : "none",
    "&:hover": {
      backgroundColor: active ? theme.colors.dark[5] : theme.colors.dark[8],
    },
  },
}));

function NavLink({ onChange, ...route }) {
  const { pathname } = useLocation();
  const ref = useRef();
  const isMobile = useMediaMatch();

  const active = useMemo(() => {
    return route.exactMatch
      ? pathname === route.path
      : pathname.includes(route.path);
  }, [route, pathname]);

  const { classes } = useNavBtnStyle({ active });

  const navigateViaShortcut = () => {
    if (!active && !isMobile) ref.current.click();
  };
  useHotkeys([[route.shortcut, navigateViaShortcut]]);

  return (
    <UnstyledButton
      ref={ref}
      component={Link}
      onClick={onChange}
      to={route.path}
      className={classes.navBtn}
    >
      <Group>
        <ThemeIcon color={primaryColor} variant={active ? "filled" : "light"}>
          {route.icon}
        </ThemeIcon>
        <Text size="sm">{route.label}</Text>
        {!isMobile && <Kbd ml="auto">{route.shortcut}</Kbd>}
      </Group>
    </UnstyledButton>
  );
}
