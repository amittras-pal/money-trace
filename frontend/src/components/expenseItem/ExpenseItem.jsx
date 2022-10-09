import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Group,
  Menu,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { CATEGORIES } from "../../constants/app.constants";
import { getDayString } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

// TODO: 'onRevert' to be used by the planned expense sesction.
export default function ExpenseItem({
  data,
  onRevert,
  onEdit,
  onDelete,
  hideMenus = false,
  flatten = false,
}) {
  const { classes } = useCardStyle({ category: data?.category, flatten });

  const itemActions = useMemo(() => {
    if (hideMenus) return null;
    const isReportOld = dayjs(data.expenseDate).isBefore(
      dayjs().subtract(2, "day")
    );

    if (isReportOld)
      return [
        {
          color: "red",
          icon: <IconArrowBackUp size={18} />,
          label: "Revert",
          onClick: () => onRevert(data),
        },
      ];
    else
      return [
        {
          icon: <IconEdit size={18} />,
          label: "Edit",
          onClick: () => onEdit(data),
        },
        {
          icon: <IconTrash size={18} />,
          label: "Delete",
          onClick: () => onDelete(data),
          color: "red",
        },
      ];
  }, [data, hideMenus, onDelete, onEdit, onRevert]);

  return (
    <Box className={classes.card}>
      <Box sx={{ flexGrow: 1 }}>
        <Text weight={500} lineClamp={2}>
          {data.reverted && (
            <ThemeIcon
              mr="xs"
              color="red"
              size={18}
              variant="filled"
              radius="lg">
              <IconArrowBackUp size={14} />
            </ThemeIcon>
          )}
          {data.title}
        </Text>
        <Text size="sm" color="dimmed">
          {data.description}
        </Text>
        <Group spacing={0} sx={{ alignItems: "center" }}>
          <Text weight={500} lineClamp={1} size="lg" mt={6} mr={12}>
            {currencyFormat.format(data.amount)}
          </Text>
          <Badge
            color={CATEGORIES[data.category].color}
            variant="light"
            size="sm"
            mr={8}>
            {data.category}
          </Badge>
          <Badge color="gray" variant="light" size="sm">
            {getDayString(data.expenseDate)}
          </Badge>
        </Group>
      </Box>
      {itemActions && (
        <Menu transition="scale-y">
          <Menu.Target>
            <ActionIcon variant="light" color="gray" radius="xl" mt={4}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {itemActions.map((action) => (
              <Menu.Item
                color={action.color}
                key={action.label}
                icon={action.icon}
                onClick={action.onClick}>
                {action.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Box>
  );
}

const useCardStyle = createStyles((theme, { category, flatten }) => ({
  card: {
    borderRadius: theme.radius.sm,
    backgroundColor: flatten ? "transparent" : theme.colors.dark[6],
    boxShadow: flatten ? "none" : theme.shadows.sm,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingLeft: flatten ? theme.spacing.md : theme.spacing.lg,
    display: "flex",
    position: "relative",
    "&:not(:last-child)": {
      marginBottom: theme.spacing.sm,
    },
    "&:before": {
      content: "''",
      height: flatten ? "80%" : "90%",
      width: 4,
      borderRadius: "4px",
      position: "absolute",
      top: "50%",
      left: flatten ? 0 : 7,
      transform: "translateY(-50%)",
      backgroundColor: theme.colors[CATEGORIES[category].color][5],
    },
  },
}));