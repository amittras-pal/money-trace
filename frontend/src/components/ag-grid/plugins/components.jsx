import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Popover,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconBookmark,
  IconCalendarCode,
  IconDotsVertical,
  IconEdit,
  IconFileAlert,
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
import { IconCalendarCode } from "@tabler/icons-react";

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

export function DescriptionHeader() {
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

export function ExpenseMetaHeader() {
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
          <IconFileAlert size={18} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={8}>
        <Text color="dimmed" fz="xs">
          Expense Metadata
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

export function ExpenseMetaCell({ data, page }) {
  if (data.linked || !data.amount)
    return (
      <Popover withinPortal withArrow shadow="md" position="bottom">
        <Popover.Target>
          <ActionIcon
            size="sm"
            radius="xl"
            color={primaryColor}
            variant="light"
          >
            <IconFileAlert size={14} stroke={1.5} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p={8}>
          <>
            {data.linked && (
              <Text
                sx={{ display: "flex", alignItems: "center" }}
                color="dimmed"
              >
                <ThemeIcon radius="lg" size="md" color="indigo" variant="light">
                  <IconCalendarCode size={14} stroke={1.5} />
                </ThemeIcon>
                <Text component="span" size="xs" color="dimmed" ml={8}>
                  {page === "budget"
                    ? "Created in a plan."
                    : "Copied to Budget."}
                </Text>
              </Text>
            )}
            {!data.amount && (
              <Text
                sx={{ display: "flex", alignItems: "center" }}
                color="dimmed"
                mt={6}
              >
                <ThemeIcon radius="lg" size="md" color="indigo" variant="light">
                  <IconBookmark size={14} stroke={1.5} />
                </ThemeIcon>
                <Text component="span" size="xs" color="dimmed" ml={8}>
                  Created to keep record; no money spent.
                </Text>
              </Text>
            )}
          </>
        </Popover.Dropdown>
      </Popover>
    );

  return null;
}

export function DescriptionCell({ value }) {
  if (!value) return null;

  return (
    <Popover withinPortal withArrow shadow="md" width={280} position="bottom">
      <Popover.Target>
        <ActionIcon size="sm" radius="xl" color={primaryColor} variant="light">
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
  onCopyToBudget,
  rowIndex,
  plan,
}) {
  const availableActions = useMemo(() => {
    const actions = [];
    if (plan) {
      actions.push("copy");
      if (plan.open && dayjs(data.date) >= dayjs().subtract(7, "days"))
        actions.push("edit", "delete");
    } else if (dayjs(data.date) >= dayjs().subtract(7, "days"))
      actions.push("edit", "delete");

    return actions;
  }, [data.date, plan]);

  if (!availableActions.length) return null;

  return (
    <Menu shadow="md" position="right-start" withinPortal>
      <Menu.Target>
        <ActionIcon
          size="sm"
          radius="xl"
          variant="light"
          disabled={!availableActions.length}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {availableActions.includes("edit") && (
          <Menu.Item
            icon={<IconEdit size={14} />}
            onClick={() => onEditExpense(data, rowIndex)}
            disabled={data.copied}
          >
            {data.copied ? "Copied Expense" : "Edit"}
          </Menu.Item>
        )}
        {availableActions.includes("copy") && (
          <Menu.Item
            icon={<IconCopy size={14} />}
            disabled={data.linked}
            onClick={() => onCopyToBudget(data)}
          >
            {data.linked ? "Copied!" : "Copy to Budget"}
          </Menu.Item>
        )}
        {availableActions.includes("delete") && (
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
