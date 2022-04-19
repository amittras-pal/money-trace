import { ActionIcon, Badge, Box, Group, Menu, Text } from "@mantine/core";
import { DotsVertical, Edit, Trash } from "tabler-icons-react";
import { CATEGORIES } from "../../../../constants/appConstants";
import { currencyFormat } from "../../../../utils/formatter.utils";

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
        alignItems: "flex-start",
        backgroundColor: "#fff",
        marginBottom: theme.spacing.sm,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.sm,
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
        <Group spacing={0}>
          <Text
            weight={500}
            lineClamp={1}
            size="lg"
            color="gray"
            my={4}
            mr={12}>
            {currencyFormat.format(data.amount)}
          </Text>
          <Badge
            color={CATEGORIES[data.category].color}
            variant="filled"
            size="sm">
            {data.category}
          </Badge>
          <Badge color="gray" variant="light" size="sm">
            {day(data.dataDate)}
          </Badge>
        </Group>
      </Box>
    </Group>
  );
}

export default ExpenseCard;
