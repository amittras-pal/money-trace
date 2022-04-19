import { Badge, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Calendar, InfoCircle } from "tabler-icons-react";
import DataTable from "../../components/dataTable/DataTable";
import LoaderOverlay from "../../components/LoaderOverlay";
import { CATEGORIES } from "../../constants/appConstants";
import { useExpenseBreakdown } from "../../queries/expense.query";
import { getUserData, percentage, severityColor } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

function Transactions() {
  const [timeFrame, setTimeFrame] = useState(new Date());

  const { data: expenseList, isLoading } = useExpenseBreakdown(
    timeFrame.getMonth() + 1,
    timeFrame.getFullYear()
  );

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        width: 10,
        Cell: ({ value = "", row }) => (
          <Group noWrap spacing={8} sx={{ minWidth: "150px" }}>
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
    ],
    []
  );

  const tableData = useMemo(
    () => expenseList?.data?.response || [],
    [expenseList]
  );

  const spentValueAndPerc = () => {
    const amount = tableData.reduce((prev, curr) => prev + curr.amount, 0);
    return { amount, perc: percentage(amount, getUserData().defaultBudget) };
  };

  const { amount, perc } = spentValueAndPerc();

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
        mb={12}
      />
      <Text weight={500} size="xs" mb={12}>
        Spent{" "}
        <Text component="span" size="xs" color={severityColor(perc)}>
          {currencyFormat.format(amount)}
        </Text>{" "}
        of{" "}
        <Text component="span" size="xs">
          {currencyFormat.format(getUserData().defaultBudget)} .
        </Text>{" "}
      </Text>
      {isLoading ? (
        <Group sx={{ height: "60%" }} direction="column" position="center">
          <LoaderOverlay />
        </Group>
      ) : (
        <DataTable
          data={tableData}
          tableHeight={"calc(100vh - 255px)"}
          sortBy={[{ id: "expenseDate", desc: true }]}
          columns={columns}
        />
      )}
    </>
  );
}

export default Transactions;
