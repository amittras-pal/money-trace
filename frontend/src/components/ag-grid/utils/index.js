import { ActionIcon, Badge, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { getColor, getIcons } from "../../../constants/categories";

export function dateFormatter({ value }) {
  return dayjs(value).format("DD MMM, hh:mm a");
}

export function Category({ value }) {
  return (
    <Badge variant="light" size="sm" color={getColor(value)}>
      {value}
    </Badge>
  );
}

export function SubCategory({ value, data, column, ...rest }) {
  const Icon = getIcons(data.category, value)[0].Icon;
  return (
    <Badge
      variant="light"
      size="sm"
      color={getColor(data.category)}
      leftSection={<Icon size={12} style={{ marginBottom: -2 }} />}
    >
      {column.actualWidth >= 250 ? value : ""}
    </Badge>
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

// function CategoryFilter(props) {}
