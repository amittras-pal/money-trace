import { Group, Text, ThemeIcon } from "@mantine/core";
import { forwardRef } from "react";
import { CATEGORIES } from "../../constants/appConstants";

export const CategorySelectItem = forwardRef(({ value, ...other }, ref) => {
  const Icon = CATEGORIES[value].icon;
  return (
    <Group
      {...other}
      ref={ref}
      direction="column"
      spacing={0}
      py={6}
      pr={6}
      pl={16}
      sx={(theme) => ({
        marginBottom: 4,
        position: "relative",
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
      })}>
      <Text size="sm" weight={500}>
        <ThemeIcon
          color={CATEGORIES[value].color}
          variant="light"
          mx={4}
          radius="xl">
          <Icon size={16} />
        </ThemeIcon>
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
        direction="column"
        spacing={0}
        py={6}
        pr={6}
        pl={16}
        sx={(theme) => ({
          marginBottom: 4,
          position: "relative",
        })}>
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
