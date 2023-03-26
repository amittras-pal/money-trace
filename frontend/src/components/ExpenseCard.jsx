import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { memo, useMemo } from "react";
import { getColor, getIcons } from "../constants/categories";
import { formatCurrency } from "../utils";
dayjs.extend(relativeTime);

function ExpenseCard({
  data,
  onEditExpense,
  onDeleteExpense,
  hideMenu = false,
  addBottomMargin = false,
}) {
  const { classes, cx } = useExpenseStyles();

  const isEditable = useMemo(
    () => dayjs(data.date) >= dayjs().subtract(7, "days"),
    [data.date]
  );

  const { color, Icon } = useMemo(
    () => ({
      color: getColor(data.category),
      Icon: getIcons(data.category, [data.subCategory])[0].Icon,
    }),
    [data.category, data.subCategory]
  );

  return (
    <Box
      className={cx(classes.wrapper, {
        [classes.addBottomMargin]: addBottomMargin,
      })}
    >
      <Group
        noWrap
        spacing={0}
        position="apart"
        align="flex-start"
        sx={{ height: "100%" }}
      >
        <Group
          spacing={6}
          sx={{
            flexGrow: 1,
            height: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text fw="bold" fz="sm">
            {data.title}
          </Text>
          {data.description && (
            <Text color="dimmed" fz="sm">
              {data.description}
            </Text>
          )}
          <Badge
            variant="light"
            size="sm"
            color={color}
            leftSection={<Icon size={12} style={{ marginBottom: -2 }} />}
          >
            {data.category} / {data.subCategory}
          </Badge>
          <Badge color="dark" size="sm" variant="filled">
            {dayjs(data.date).fromNow()}
          </Badge>
          <Text fz="lg" fw="bold" mt="auto">
            {formatCurrency(data.amount)}
          </Text>
        </Group>
        <Group sx={{ flexDirection: "column" }} spacing="xs">
          {!hideMenu && (
            <Menu shadow="md" position="bottom-end">
              <Menu.Target>
                <ActionIcon size="sm" radius="xl" variant="light">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {isEditable && (
                  <Menu.Item
                    icon={<IconEdit size={14} />}
                    onClick={() => onEditExpense(data)}
                  >
                    Edit
                  </Menu.Item>
                )}
                {isEditable && (
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={14} />}
                    onClick={() => onDeleteExpense(data)}
                  >
                    Delete
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </Box>
  );
}

export default memo(
  ExpenseCard,
  (prev, next) => JSON.stringify(prev.data) === JSON.stringify(next.data)
);

const useExpenseStyles = createStyles((theme) => ({
  wrapper: {
    height: "100%",
    border: `1px solid ${theme.colors.dark[4]}`,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    transition: "all 0.25s ease-in-out",
  },
  addBottomMargin: {
    marginBottom: theme.spacing.xs,
  },
}));
