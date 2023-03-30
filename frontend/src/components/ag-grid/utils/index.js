import {
  ActionIcon,
  Badge,
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
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getColor } from "../../../constants/categories";
import ExpenseDescription from "../../ExpenseDescription";

function getNextSortOrder(current) {
  if (!current) return "asc";
  if (current === "asc") return "desc";
  return null;
}

export function dateFormatter({ value }) {
  return dayjs(value).format("DD MMM, hh:mm a");
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
          color={isFilterActive ? "blue" : "gray"}
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
          color={props.column.sort ? "blue" : "gray"}
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

export function Category({ data, value }) {
  return (
    <Badge
      size="sm"
      component="div"
      variant="light"
      color={getColor(data.category)}
    >
      {value}
    </Badge>
  );
}

export function DescriptionHeader() {
  return (
    <ThemeIcon size="sm" radius="xl" color="orange" variant="light" mx="auto">
      <IconInfoCircle size={18} />
    </ThemeIcon>
  );
}

export function Description({ value }) {
  if (!value)
    return (
      <ActionIcon size="sm" radius="xl" disabled>
        <IconInfoCircle size={18} />
      </ActionIcon>
    );
  else
    return (
      <Popover withinPortal shadow="md" width={280} position="right-start">
        <Popover.Target>
          <ActionIcon size="sm" radius="xl" color="blue" variant="light">
            <IconInfoCircle size={18} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ExpenseDescription>{value}</ExpenseDescription>
        </Popover.Dropdown>
      </Popover>
    );
}

export function RowMenu({ data, onEditExpense, onDeleteExpense }) {
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
  );
}
