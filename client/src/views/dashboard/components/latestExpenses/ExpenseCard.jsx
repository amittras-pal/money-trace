import { ActionIcon, Badge, Box, Group, Menu, Text } from "@mantine/core";
import React from "react";
import { DotsVertical, Edit, Trash } from "tabler-icons-react";
import { CATEGORIES } from "../../../../constants/appConstants";

function ExpenseCard({ data }) {
  const day = (dateString) => {
    return new Date().getDate() === new Date(dateString).getDate()
      ? "Today"
      : "Yesterday";
  };

  return (
    <Group
      noWrap
      py={8}
      px={12}
      spacing={8}
      sx={(theme) => ({
        backgroundColor: theme.colors[CATEGORIES[data.category].color][0],
        marginBottom: theme.spacing.md,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.md,
        position: "relative",
        "&:before": {
          content: "''",
          height: "85%",
          width: 4,
          borderRadius: "4px",
          position: "absolute",
          top: "50%",
          left: 6,
          transform: "translateY(-50%)",
          backgroundColor: theme.colors[CATEGORIES[data.category].color][5],
        },
      })}>
      <Menu
        control={
          <ActionIcon variant="hover" color="gray" radius="xl">
            <DotsVertical size={16} />
          </ActionIcon>
        }>
        <Menu.Item icon={<Edit size={14} />}>Edit Expense</Menu.Item>
        <Menu.Item color="red" icon={<Trash size={14} />}>
          Delete
        </Menu.Item>
      </Menu>
      <Box>
        <Text weight={500} lineClamp={1}>
          {data.title}
        </Text>
        <Text size="sm" color="dimmed">
          {data.description}
        </Text>
        <Badge
          color={CATEGORIES[data.category].color}
          variant="filled"
          size="sm"
          mr={8}>
          {data.category}
        </Badge>
        <Badge color="gray" variant="light" size="sm">
          {day(data.dataDate)}
        </Badge>
      </Box>
    </Group>
  );
}

export default ExpenseCard;
