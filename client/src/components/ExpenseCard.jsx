import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Text,
  ThemeIcon,
} from "@mantine/core";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ArrowBackUp, DotsVertical, Edit, Trash } from "tabler-icons-react";
import { CATEGORIES } from "../constants/appConstants";
import { currencyFormat } from "../utils/formatter.utils";

function ExpenseCard({ data, onEdit, onDelete, onRevert, hideMenus = false }) {
  const getDayString = (dateString) => {
    if (dayjs(dateString).isSame(dayjs(), "date")) return "Today";
    else if (dayjs(dateString).isSame(dayjs().subtract(1, "day"), "date"))
      return "Yesterday";
    else return dayjs(dateString).format("MMM DD, 'YY");
  };

  const isReportOld = useMemo(() => {
    return dayjs(data.expenseDate).isBefore(dayjs().subtract(2, "day"));
  }, [data.expenseDate]);

  const Icon = CATEGORIES[data.category].icon;

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
          theme.colorScheme === "light" ? "#fff" : theme.colors.gray[9],
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
        <Text weight={500} lineClamp={2}>
          {data.reverted && (
            <ThemeIcon
              mr="xs"
              color="red"
              size={18}
              variant="filled"
              radius="lg">
              <ArrowBackUp size={14} />
            </ThemeIcon>
          )}
          {data.title}
        </Text>
        <Text size="sm" color="dimmed">
          {data.description}
        </Text>
        <Group spacing={0} sx={{ alignItems: "center" }}>
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
            pl={0}
            leftSection={
              <ThemeIcon
                color={CATEGORIES[data.category].color}
                size={18}
                variant="filled"
                radius="lg"
                mt={8}>
                <Icon />
              </ThemeIcon>
            }
            variant="light"
            size="md"
            mr={8}>
            {data.category}
          </Badge>
          <Badge color="gray" variant="light" size="sm">
            {getDayString(data.expenseDate)}
          </Badge>
        </Group>
      </Box>
      {!hideMenus && !data.reverted && (
        <Menu
          control={
            <ActionIcon variant="hover" color="gray" radius="xl" mt={4}>
              <DotsVertical size={16} />
            </ActionIcon>
          }>
          {!isReportOld && (
            <Menu.Item icon={<Edit size={18} />} onClick={() => onEdit(data)}>
              Edit
            </Menu.Item>
          )}
          {!isReportOld && (
            <Menu.Item
              color="red"
              icon={<Trash size={18} />}
              onClick={() => onDelete(data)}>
              Delete
            </Menu.Item>
          )}
          {isReportOld && (
            <Menu.Item
              color="red"
              icon={<ArrowBackUp size={18} />}
              onClick={() => onRevert(data)}>
              Revert
            </Menu.Item>
          )}
        </Menu>
      )}
    </Group>
  );
}

export default ExpenseCard;
