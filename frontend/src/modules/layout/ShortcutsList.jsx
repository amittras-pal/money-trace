import {
  Box,
  Divider,
  Kbd,
  SimpleGrid,
  Text,
  ThemeIcon,
  createStyles,
} from "@mantine/core";
import { IconMapPinFilled } from "@tabler/icons-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { planDetailsPath, primaryColor } from "../../constants/app";

export default function ShortcutsList() {
  const { pathname } = useLocation();
  const { classes, cx } = useStyles();

  return (
    <>
      <Text fz="md" fw="bold" mb="sm">
        Global
      </Text>
      <Text fz="xs" mb="xs">
        <Kbd>I</Kbd> - Open Keyboard Shortcuts.
      </Text>
      <Divider my="sm" />
      <SimpleGrid
        cols={2}
        spacing="sm"
        mb="sm"
        breakpoints={[
          { maxWidth: "md", cols: 2, spacing: "sm", verticalSpacing: "sm" },
          { maxWidth: "sm", cols: 1, spacing: "sm", verticalSpacing: "sm" },
        ]}
      >
        <Box
          className={cx(classes.block, {
            [classes.highlight]: pathname === "/",
          })}
        >
          <Text
            fz="md"
            fw="bold"
            mb="sm"
            color={pathname === "/" ? primaryColor : ""}
          >
            Dashboard {pathname === "/" && <YouAreHere />}
          </Text>
          <Text fz="xs" mb="xs">
            <Kbd>N</Kbd> - Create New Expense.
          </Text>
          <Text fz="xs" mb="xs">
            <Kbd>Shift+S</Kbd> - Toggle category selection
          </Text>
        </Box>
        <Box
          className={cx(classes.block, {
            [classes.highlight]: pathname === "/expenses",
          })}
        >
          <Text
            fz="md"
            fw="bold"
            mb="sm"
            color={pathname === "/expenses" ? primaryColor : ""}
          >
            Expenses List {pathname === "/expenses" && <YouAreHere />}
          </Text>
          <Text fz="xs" mb="xs">
            <Kbd>X</Kbd> - Clear Applied Filters on Table.
          </Text>
        </Box>
        <Box
          className={cx(classes.block, {
            [classes.highlight]: pathname === "/plans",
          })}
        >
          <Text
            fz="md"
            fw="bold"
            mb="sm"
            color={pathname === "/plans" ? primaryColor : ""}
          >
            Plans List {pathname === "/plans" && <YouAreHere />}
          </Text>
          <Text fz="xs" mb="xs">
            <Kbd>N</Kbd> - Create New Plan.
          </Text>
        </Box>
        <Box
          className={cx(classes.block, {
            [classes.highlight]: pathname.match(planDetailsPath),
          })}
        >
          <Text
            fz="md"
            fw="bold"
            mb="sm"
            color={pathname.match(planDetailsPath) ? primaryColor : ""}
          >
            Plan Details {pathname.match(planDetailsPath) && <YouAreHere />}
          </Text>
          <Text fz="xs" mb="xs">
            <Kbd>N</Kbd> - Add New Expense to plan.
          </Text>
        </Box>
      </SimpleGrid>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  block: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  highlight: {
    backgroundColor: theme.colors.dark[8],
    border: "1px solid",
    borderColor: theme.primaryColor,
  },
}));

function YouAreHere() {
  return (
    <ThemeIcon color={primaryColor} variant="light" size="sm" radius="lg">
      <IconMapPinFilled size={12} />
    </ThemeIcon>
  );
}
