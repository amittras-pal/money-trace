import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { DotsVertical, Edit, Trash } from "tabler-icons-react";
import LoaderOverlay from "../../../components/LoaderOverlay";
import { CATEGORIES } from "../../../constants/appConstants";
import { useLast2DaysExpenses } from "../../../queries/expense.query";

function LastTwoDays() {
  const { data: last2Days, isLoading } = useLast2DaysExpenses();
  const day = (dateString) => {
    return new Date().getDate() === new Date(dateString).getDate()
      ? "Today"
      : "Yesterday";
  };

  if (isLoading)
    return (
      <Group position="center" py={32}>
        <LoaderOverlay />
      </Group>
    );

  return (
    <Box mt="md">
      <Text weight={500} color="indigo" mb={0}>
        Expenses from last 2 days.
      </Text>
      <Divider variant="dashed" color="indigo" my="md" />
      {last2Days.data.response.map((expense) => {
        return (
          <Group
            noWrap
            p={8}
            spacing={8}
            key={expense._id}
            sx={(theme) => ({
              backgroundColor:
                theme.colors[CATEGORIES[expense.category].color][0],
              marginBottom: theme.spacing.md,
              borderRadius: theme.radius.md,
              boxShadow: theme.shadows.md,
              borderLeft: `3px solid ${
                theme.colors[CATEGORIES[expense.category].color][5]
              }`,
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
                {expense.title}
              </Text>
              <Text size="sm" color="dimmed">
                {expense.description}
              </Text>
              <Badge
                color={CATEGORIES[expense.category].color}
                variant="filled"
                size="sm"
                mr={8}>
                {expense.category}
              </Badge>
              <Badge color="gray" variant="light" size="sm">
                {day(expense.expenseDate)}
              </Badge>
            </Box>
          </Group>
        );
      })}
    </Box>
  );
}

export default LastTwoDays;
