import {
  ActionIcon,
  Badge,
  Box,
  createStyles,
  Group,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendarUp,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { memo, useMemo } from "react";
import { Icons } from "../constants/categories";
import { formatCurrency } from "../utils";
import ExpenseDescription from "./ExpenseDescription";
dayjs.extend(relativeTime);

function ExpenseCard({
  data,
  onEditExpense,
  onDeleteExpense,
  hideMenu = false,
}) {
  const { classes } = useExpenseStyles();

  const isEditable = useMemo(
    () => dayjs(data.date) >= dayjs().subtract(7, "days"),
    [data.date]
  );

  const Icon = useMemo(() => Icons[data.category.icon], [data.category]);

  return (
    <Box className={classes.wrapper}>
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
            {dayjs(data.date).month() !== dayjs().month() && (
              <Tooltip
                label={
                  <Text component="span" fw="normal">
                    From {dayjs().subtract(1, "month").format("MMMM")}
                  </Text>
                }
                color="dark"
                position="right"
                events={{ touch: true }}
              >
                <ThemeIcon size={"sm"} color="orange" variant="outline" mr={4}>
                  <IconCalendarUp size={14} />
                </ThemeIcon>
              </Tooltip>
            )}
            {data.title}
          </Text>
          {data.description && (
            <ExpenseDescription color="dimmed" fz="sm">
              {data.description}
            </ExpenseDescription>
          )}
          <Badge
            variant="light"
            size="sm"
            color={data.category.color}
            leftSection={<Icon size={12} style={{ marginBottom: -2 }} />}
          >
            {data.category.group}{" "}
            <IconChevronRight size={12} style={{ marginBottom: -2 }} />{" "}
            {data.category.label}
          </Badge>
          <Group position="apart" align="center" mt={4}>
            <Badge color="dark" size="sm" variant="filled">
              {dayjs(data.date).fromNow()}
            </Badge>
            <Text fz="lg" fw="bold" mt="auto">
              {formatCurrency(data.amount)}
            </Text>
          </Group>
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
    "&:not(:last-child)": {
      marginBottom: theme.spacing.xs,
    },
  },
}));
