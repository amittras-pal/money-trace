import { Group, Navbar, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAppStyles } from "./styles";

function NavLink({ icon, label, path, disabled, exactMatch, onChange }) {
  const { pathname } = useLocation();
  const matching = useMemo(() => {
    return exactMatch ? pathname === path : pathname.includes(path);
  }, [exactMatch, path, pathname]);

  return (
    <UnstyledButton
      component={Link}
      onClick={onChange}
      to={path}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        opacity: disabled ? 0.5 : 1,
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: matching ? theme.colors.dark[5] : "transparent",
        boxShadow: matching ? theme.shadows.md : "none",
        pointerEvents: disabled ? "none" : "auto",
        "&:hover": {
          backgroundColor: matching
            ? theme.colors.dark[5]
            : theme.colors.dark[8],
        },
      })}
    >
      <Group>
        <ThemeIcon color="indigo" variant={matching ? "filled" : "light"}>
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
        {matching && (
          <IconChevronRight size={16} style={{ marginLeft: "auto" }} />
        )}
      </Group>
    </UnstyledButton>
  );
}

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
