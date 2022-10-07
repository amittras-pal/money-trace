import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import {
  IconArrowsDoubleSwNe,
  IconChevronRight,
  IconDashboard,
  IconReport,
} from "@tabler/icons";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// TODO: Export this from the constants.
const data = [
  {
    icon: <IconDashboard size={16} />,
    label: "Dashboard",
    path: "/",
    exactMatch: true,
  },
  {
    icon: <IconArrowsDoubleSwNe size={16} />,
    label: "Transactions List",
    path: "/transactions",
    exactMatch: true,
  },
  {
    icon: <IconReport size={16} />,
    label: "Planned Reports",
    path: "/planned-reports",
    exactMatch: false,
  },
  // {
  //   icon: <IconArrowAutofitLeft size={16} />,
  //   label: "Databases",
  // },
];

function MainLink({ icon, label, path, exactMatch, onChange }) {
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
        backgroundColor: matching ? theme.colors.dark[6] : "transparent",
        "&:hover": {
          backgroundColor: theme.colors.dark[6],
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
  const links = data.map((link) => (
    <MainLink {...link} key={link.label} onChange={onChange} />
  ));
  return <>{links}</>;
}
