import { Badge, Group, Text, ThemeIcon } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar } from "tabler-icons-react";
import DataTable from "../../components/dataTable/DataTable";
import SelectionFilter from "../../components/dataTable/SelectionFilter";
import LoaderOverlay from "../../components/LoaderOverlay";
import { CATEGORIES } from "../../constants/appConstants";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useBudget } from "../../queries/budget.query";
import { useExpenseBreakdown } from "../../queries/expense.query";
import {
  getUserDetails,
  percentage,
  severityColor,
} from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

function Transactions() {
  const [timeFrame, setTimeFrame] = useState(new Date());
  const [params] = useSearchParams();

  const { onError } = useErrorHandler();

  const { data: expenseList, isLoading } = useExpenseBreakdown(
    timeFrame.getMonth() + 1,
    timeFrame.getFullYear(),
    { onError }
  );

  const { data: budget } = useBudget(
    timeFrame.getMonth() + 1,
    timeFrame.getFullYear(),
    { onError }
  );

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        minWidth: 240,
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ value = "", row }) => (
          <Group
            noWrap
            spacing={4}
            direction="column"
            sx={{ minWidth: "150px" }}>
            <Text>{value.slice(0, 40)}</Text>
            {row.original.description && (
              <Text size="xs" color="dimmed">
                {row.original.description}
              </Text>
            )}
          </Group>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        disableFilters: true,
        Cell: ({ value }) => (
          <Text weight={500} size="sm" sx={{ minWidth: "150px" }}>
            {currencyFormat.format(value)}
          </Text>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        filter: "includes",
        Filter: SelectionFilter,
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
        disableFilters: true,
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
    return { amount, perc: percentage(amount, budget?.data?.response?.amount) };
  };

  const { amount, perc } = spentValueAndPerc();

  return (
    <>
      <DatePicker
        value={timeFrame}
        onChange={setTimeFrame}
        maxDate={new Date()}
        minDate={new Date(getUserDetails()?.createdAt)}
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
          {currencyFormat.format(budget?.data?.response?.amount || 0)} .
        </Text>{" "}
      </Text>
      {isLoading ? (
        <Group sx={{ height: "60%" }} direction="column" position="center">
          <LoaderOverlay />
        </Group>
      ) : (
        <DataTable
          data={tableData}
          columns={columns}
          tableHeight={"calc(100vh - 255px)"}
          sortBy={[{ id: "expenseDate", desc: true }]}
          filters={
            params?.get("category")
              ? [{ id: "category", value: params?.get("category") }]
              : []
          }
        />
      )}
    </>
  );
}

export default Transactions;
