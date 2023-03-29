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
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconFilter,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getColor } from "../../../constants/categories";
import ExpenseDescription from "../../ExpenseDescription";

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
    <Group position="apart" sx={{ width: "100%" }}>
      <Text fw="bold">{props.displayName}</Text>
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
    </Group>
  );
}

export function Category({ data }) {
  return (
    <Badge
      size="sm"
      component="div"
      variant="light"
      color={getColor(data.category)}
    >
      {data.category}{" "}
      <IconChevronRight size={12} style={{ marginBottom: -2 }} />{" "}
      {data.subCategory}
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
      <Popover
        withinPortal
        withArrow
        shadow="md"
        width={280}
        position="bottom-start"
      >
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
