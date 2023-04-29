import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Popover,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconDotsVertical,
  IconEdit,
  IconFilter,
  IconInfoCircle,
  IconSortAscending,
  IconSortDescending,
  IconTemplate,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { primaryColor } from "../../../constants/app";
import ExpenseDescription from "../../ExpenseDescription";

function getNextSortOrder(current) {
  if (!current) return "asc";
  if (current === "asc") return "desc";
  return null;
}

export function ColumnHeader(props) {
  const [isFilterActive, setIsFilterActive] = useState(false);
  useEffect(() => {
    const instance = props.api.getFilterInstance(props.column.colId);
    setIsFilterActive(instance?.isFilterActive() ?? false);
  }, [props]);

  return (
    <Group position="start" sx={{ width: "100%" }} spacing="xs">
      <Text fw="bold" mr="auto">
        {props.displayName}
      </Text>
      {props.enableMenu && (
        <ActionIcon
          size="md"
          radius="xl"
          color={isFilterActive ? primaryColor : "gray"}
          variant={"filled"}
          onClick={(e) => props.showColumnMenu(e.target)}
        >
          <IconFilter size={16} />
        </ActionIcon>
      )}
      {props.enableSorting && (
        <ActionIcon
          size="md"
          radius="xl"
          color={props.column.sort ? primaryColor : "gray"}
          variant={"filled"}
          onClick={(e) =>
            props.setSort(getNextSortOrder(props.column.sort), e.shiftKey)
          }
        >
          {!props.column.sort && <IconArrowsSort size={16} />}
          {props.column.sort === "asc" && <IconSortAscending size={16} />}
          {props.column.sort === "desc" && <IconSortDescending size={16} />}
        </ActionIcon>
      )}
    </Group>
  );
}

export function RowCount({ api }) {
  return (
    <Text component="span" mx="auto" color="red" fw="bold">
      {api.getDisplayedRowCount()}
    </Text>
  );
}

export function DescriptionColumnHeader() {
  return (
    <Popover withinPortal withArrow shadow="md" width={280} position="bottom">
      <Popover.Target>
        <ActionIcon
          size="sm"
          radius="xl"
          color="orange"
          mx="auto"
          variant="light"
        >
          <IconInfoCircle size={18} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={8}>
        <Text color="dimmed" fz="xs">
          Expense Description
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export function CategoryCell({ data, value }) {
  return (
    <Badge
      size="sm"
      component="div"
      variant="light"
      color={data.category.color}
    >
      {value}
    </Badge>
  );
}

export function DescriptionCell({ value }) {
  if (!value)
    return (
      <ActionIcon size="sm" radius="xl" disabled>
        <IconInfoCircle size={18} />
      </ActionIcon>
    );
  else
    return (
      <Popover withinPortal withArrow shadow="md" width={280} position="bottom">
        <Popover.Target>
          <ActionIcon
            size="sm"
            radius="xl"
            color={primaryColor}
            variant="light"
          >
            <IconInfoCircle size={18} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p={8}>
          <ExpenseDescription color="dimmed">{value}</ExpenseDescription>
        </Popover.Dropdown>
      </Popover>
    );
}

export function RowMenuCell({
  data,
  onEditExpense,
  onDeleteExpense,
  rowIndex,
}) {
  const isEditable = useMemo(
    () => dayjs(data.date) >= dayjs().subtract(7, "days"),
    [data.date]
  );

  return (
    <Menu shadow="md" position="right-start" withinPortal>
      <Menu.Target>
        <ActionIcon
          size="sm"
          radius="xl"
          variant="light"
          disabled={!isEditable}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {isEditable && (
          <Menu.Item
            icon={<IconEdit size={14} />}
            onClick={() => onEditExpense(data, rowIndex)}
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
  );
}

export function NoDataOverlay(props) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: "1.25rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeIcon size={140} variant="light" radius="lg">
        <IconTemplate size={100} />
      </ThemeIcon>
      <Text
        ta="center"
        sx={(theme) => ({ color: theme.colors[primaryColor][4] })}
      >
        {props.message}
      </Text>
    </Box>
  );
}
