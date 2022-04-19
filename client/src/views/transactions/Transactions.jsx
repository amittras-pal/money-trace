import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Calendar,
  DotsVertical,
  Edit,
  InfoCircle,
  Trash,
} from "tabler-icons-react";
import DataTable from "../../components/dataTable/DataTable";
import LoaderOverlay from "../../components/LoaderOverlay";
import { CATEGORIES } from "../../constants/appConstants";
import { useExpenseBreakdown } from "../../queries/expense.query";
import { currencyFormat } from "../../utils/formatter.utils";

function Transactions() {
  const [timeFrame, setTimeFrame] = useState(new Date());

  const { data: expenseList, isLoading } = useExpenseBreakdown(
    timeFrame.getMonth() + 1,
    timeFrame.getFullYear()
  );

  const columns = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const columnConfigs = [
      {
        accessor: "_id",
        cellClass: "action",
        disableSoryBy: true,
        Cell: ({ value = "" }) => (
          <Menu
            control={
              <ActionIcon variant="light">
                <DotsVertical size={16} />
              </ActionIcon>
            }>
            <Menu.Item
              onClick={() => console.log(value)}
              icon={<Edit size={14} />}>
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => console.log(value)}
              color="red"
              icon={<Trash size={14} />}>
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
              placement="start"
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
          <Text weight={500} size="sm" sx={{ minWidth: "150px" }}>
            {currencyFormat.format(value)}
          </Text>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <Group sx={{ width: "150px" }}>
            <Badge variant="light" color={CATEGORIES[value].color}>
              {value}
            </Badge>
          </Group>
        ),
      },
      {
        Header: "Date",
        accessor: "expenseDate",
        columnId: "expenseDate",
        Cell: ({ value }) => {
          return (
            <Group spacing="sm" noWrap sx={{ width: "150px" }}>
              <ThemeIcon radius="xl" size="md" color="indigo" variant="light">
                <Calendar size={16} />
              </ThemeIcon>
              <Text size="sm">
                {dayjs(value.split("T")[0]).format("MMMM DD")}
              </Text>
            </Group>
          );
        },
      },
    ];
    if (
      currentMonth > timeFrame.getMonth() + 1 ||
      currentYear > timeFrame.getFullYear()
    )
      columnConfigs.splice(0, 1);
    return columnConfigs;
  }, [timeFrame]);

  const tableData = useMemo(
    () => expenseList?.data?.response || [],
    [expenseList]
  );

  return (
    <>
      <DatePicker
        value={timeFrame}
        onChange={setTimeFrame}
        maxDate={new Date()}
        minDate={new Date("2021-11-01")}
        allowLevelChange={false}
        size="sm"
        description="Records will be shown for the selected month"
        clearable={false}
        initialLevel="month"
        dropdownType="modal"
        mb="md"
      />
      {isLoading ? (
        <Group sx={{ height: "60%" }} direction="column" position="center">
          <LoaderOverlay />
        </Group>
      ) : (
        <DataTable
          data={tableData}
          tableHeight={"calc(100vh - 230px)"}
          sortBy={[{ id: "expenseDate", desc: true }]}
          columns={columns}
        />
      )}
    </>
  );
}

export default Transactions;
