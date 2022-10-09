import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Divider,
  Menu,
  Text,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconSquareForbid2,
  IconTrash,
} from "@tabler/icons";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function PlanCard({
  data,
  onEdit,
  onClose,
  onDelete,
  flatten = false,
  hideMenus = false,
}) {
  const { classes } = useCardStyle({ flatten, open: data?.open });

  const cardActions = useMemo(() => {
    if (hideMenus) return null;
    if (data?.open)
      return [
        {
          icon: <IconEdit size={18} />,
          label: "Edit Plan Details",
          onClick: () => onEdit(data),
        },
        {
          icon: <IconSquareForbid2 size={18} />,
          label: "Close Expense Plan",
          onClick: () => onClose(data),
          color: "red",
        },
      ];
    else
      return [
        {
          icon: <IconTrash size={18} />,
          label: "Delete",
          onClick: () => onDelete(data),
          color: "red",
        },
      ];
  }, [data, hideMenus, onClose, onDelete, onEdit]);

  return (
    <Box className={classes.card}>
      <Box sx={{ flexGrow: 1 }} mr={6}>
        <Text
          weight={500}
          lineClamp={2}
          component={hideMenus ? "span" : Link}
          to={`/planned-reports/${data._id}`}>
          {data.name}
        </Text>
        <Text size="sm" color="dimmed">
          {data.description}
        </Text>
        <Divider my="sm" />
        <Text size="sm" color="dimmed">
          Created: {dayjs(data.createdAt).format("DD MMM, 'YY")}
          <Badge
            ml="md"
            component="span"
            variant="light"
            size="sm"
            color={data?.open ? "indigo" : "red"}>
            {data?.open ? "Open" : "Closed"}
          </Badge>
        </Text>
      </Box>
      {cardActions && (
        <Menu transition="scale-y" shadow="lg" position="left-start">
          <Menu.Target>
            <ActionIcon variant="light" color="gray" radius="xl" mt={4}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {cardActions.map((action) => (
              <Menu.Item
                sx={{ whiteSpace: "nowrap" }}
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

const useCardStyle = createStyles((theme, { flatten, open }) => ({
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
    "&:before": {
      content: "''",
      height: flatten ? "80%" : "90%",
      width: 4,
      borderRadius: "4px",
      position: "absolute",
      top: "50%",
      left: flatten ? 0 : 7,
      transform: "translateY(-50%)",
      backgroundColor: theme.colors[open ? "indigo" : "red"][5],
    },
  },
}));
