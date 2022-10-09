import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ROUTES } from "../../../constants/app.constants";

function NavLink({ icon, label, path, exactMatch, onChange }) {
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
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: matching ? theme.colors.dark[5] : "transparent",
        boxShadow: matching ? theme.shadows.md : "none",
        "&:hover": {
          backgroundColor: matching
            ? theme.colors.dark[5]
            : theme.colors.dark[8],
        },
      })}>
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

export default function Navigation({ onChange }) {
  return (
    <>
      {NAV_ROUTES.map((link) => (
        <NavLink {...link} key={link.label} onChange={onChange} />
      ))}
    </>
  );
}
