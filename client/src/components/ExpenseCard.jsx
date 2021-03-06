import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Text,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import { DotsVertical, Edit, Trash } from "tabler-icons-react";
import { CATEGORIES } from "../constants/appConstants";
import { currencyFormat } from "../utils/formatter.utils";

function ExpenseCard({ data, onEdit, onDelete, hideMenus = false }) {
  const getDayString = (dateString) => {
    if (dayjs(dateString).isSame(dayjs(), "date")) return "Today";
    else if (dayjs(dateString).isSame(dayjs().subtract(1, "day"), "date"))
      return "Yesterday";
    else return dayjs(dateString).format("MMM DD, 'YY");
  };

  const isOldReport = () => {
    const isOld = dayjs(data.expenseDate).isBefore(dayjs().subtract(2, "day"));
    return isOld;
  };

  return (
    <Group
      noWrap
      py={8}
      px={12}
      spacing={8}
      position="apart"
      sx={(theme) => ({
        alignItems: "flex-start",
        backgroundColor:
          theme.colorScheme === "light" ? "#fff" : theme.colors.gray[8],
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
      <Box ml={8}>
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
            size="sm"
            mr={8}>
            {data.category}
          </Badge>
          <Badge color="gray" variant="light" size="sm">
            {getDayString(data.expenseDate)}
          </Badge>
        </Group>
      </Box>
      {!hideMenus && !isOldReport() && (
        <Menu
          control={
            <ActionIcon variant="hover" color="gray" radius="xl" mt={4}>
              <DotsVertical size={16} />
            </ActionIcon>
          }>
          <Menu.Item icon={<Edit size={14} />} onClick={() => onEdit(data)}>
            Edit
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<Trash size={14} />}
            onClick={() => onDelete(data)}>
            Delete
          </Menu.Item>
        </Menu>
      )}
      {!hideMenus && isOldReport() && (
        <Tooltip
          position="bottom"
          placement="end"
          label="Expense older than 2 days cannot be edited.">
          <ActionIcon color="gray" variant="hover" disabled>
            <DotsVertical size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}

export default ExpenseCard;
