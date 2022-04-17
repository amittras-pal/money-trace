import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { useMemo } from "react";
import {
  Calendar,
  DotsVertical,
  Edit,
  InfoCircle,
  Trash,
} from "tabler-icons-react";
import DataTable from "../../../components/dataTable/DataTable";
import LoaderOverlay from "../../../components/LoaderOverlay";
import { CATEGORIES } from "../../../constants/appConstants";
import { useExpenseBreakdown } from "../../../queries/expense.query";
import { currencyFormat, datOfMonth } from "../../../utils/formatter.utils";

function BudgetBreakdown() {
  const { data: expenseList, isLoading } = useExpenseBreakdown(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );

  const columns = useMemo(
    () => [
      {
        accessor: "_id",
        cellClass: "action",
        Cell: ({ value = "" }) => (
          <Menu
            control={
              <ActionIcon variant="light">
                <DotsVertical size={16} />
              </ActionIcon>
            }>
            <Menu.Item icon={<Edit size={14} />}>Edit</Menu.Item>
            <Menu.Item color="red" icon={<Trash size={14} />}>
              Delete
            </Menu.Item>
          </Menu>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        width: 10,
        Cell: ({ value = "", row }) => (
          <Group noWrap spacing={8}>
            {value.slice(0, 40)}
            <Tooltip
              label={row.original?.description}
              disabled={!row.original.description}
              placement="end"
              position="bottom">
              <ThemeIcon
                variant="light"
                radius="xl"
                size="sm"
                sx={{
                  cursor: row.original.description ? "pointer" : "default",
                }}
                color={row.original.description ? "indogo" : "red"}>
                <InfoCircle size={16} />
              </ThemeIcon>
            </Tooltip>
          </Group>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => (
          <Text weight={500} size="sm">
            {currencyFormat.format(value)}
          </Text>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <Group>
            <Badge variant="light" color={CATEGORIES[value].color}>
              {value}
            </Badge>
          </Group>
        ),
      },
      {
        Header: "Date",
        accessor: "expenseDate",
        Cell: ({ value }) => (
          <Group spacing="sm" noWrap>
            <ThemeIcon radius="xl" size="md" color="indigo" variant="light">
              <Calendar size={16} />
            </ThemeIcon>
            <Text size="sm">{datOfMonth.format(new Date(value))}</Text>
          </Group>
        ),
      },
    ],
    []
  );

  const tableData = useMemo(
    () => expenseList?.data?.response || [],
    [expenseList]
  );

  if (isLoading)
    return (
      <Group sx={{ height: "60%" }} direction="column" position="center">
        <LoaderOverlay />
      </Group>
    );

  return (
    <DataTable
      data={tableData}
      tableHeight={"calc(100vh - 320px)"}
      columns={columns}
    />
  );
}

export default BudgetBreakdown;
