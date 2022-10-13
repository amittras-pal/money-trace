import { Group, Text } from "@mantine/core";
import { forwardRef } from "react";
import { CATEGORIES } from "../../constants/app.constants";

export const CategorySelectItem = forwardRef(({ value, ...other }, ref) => {
  return (
    <Group
      {...other}
      ref={ref}
      sx={(theme) => ({
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 4,
        position: "relative",
        backgroundColor: other["aria-selected"]
          ? `${theme.colors.dark[8]} !important`
          : "transparent",
        "&:before": {
          content: "''",
          height: "85%",
          width: 4,
          borderRadius: "4px",
          position: "absolute",
          top: "50%",
          left: 4,
          transform: "translateY(-50%)",
          backgroundColor: theme.colors[CATEGORIES[value].color][5],
        },
      })}
      spacing={0}
      py={6}
      pr={6}
      pl={16}>
      <Text size="sm" weight={500}>
        {value}
      </Text>
      <Text size="xs" color="dimmed">
        {CATEGORIES[value].description}
      </Text>
    </Group>
  );
});

export const ReportSelectItem = forwardRef(
  ({ name, _id, description, createdAt, updatedAt, ...other }, ref) => {
    return (
      <Group
        {...other}
        ref={ref}
        spacing={0}
        p={6}
        sx={{
          marginBottom: 4,
          position: "relative",
          flexDirection: "column",
          alignItems: "flex-start",
        }}>
        <Text size="sm" weight={500}>
          {name}
        </Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </Group>
    );
  }
);
