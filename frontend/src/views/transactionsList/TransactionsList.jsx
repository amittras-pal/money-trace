import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import { Select, SimpleGrid, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import { CATEGORIES, MONTHS } from "../../constants/app.constants";
import { useAuth } from "../../context/UserContext";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useBudget } from "../../services/budget.service";
import { useExpenseBreakdown } from "../../services/expense.service";
import "../../theme/table-style.css";
import { percentage, severityColor } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";
import RevertExpense from "../plannedReports/components/RevertExpense";
import {
  AmountColumn,
  CategoryColumn,
  MenuColumn,
  TitleColumn,
} from "./renderers";

function TransactionsList() {
  const { onError } = useErrorHandler();
  const { userData } = useAuth();
  const [timeFrame, setTimeFrame] = useState({
    month: dayjs().month(),
    year: dayjs().year(),
  });
  const [revertExpense, setRevertExpense] = useState(null);
  // const [params] = useSearchParams();

  const timeFrameOptions = useMemo(() => {
    if (!userData) return { months: [], years: [] };

    const currentYear = dayjs().year();
    const registrationYear = dayjs(userData?.createdAt).year();
    const numOfYears = currentYear - registrationYear;

    let years = [];
    for (let i = numOfYears; i >= 0; i--) {
      years.push({ label: currentYear - i, value: currentYear - i });
    }

    const months = MONTHS.map((month) => {
      let disableMonth = false;
      if (timeFrame.year === dayjs(userData.createdAt).year()) {
        if (
          month.value < dayjs(userData?.createdAt).month() ||
          month.value > dayjs().month()
        )
          disableMonth = true;
      }
      return { ...month, disabled: disableMonth };
    });

    return { years, months };
  }, [userData, timeFrame]);

  const { data: budget, isLoading: loadingBudgets } = useBudget(
    timeFrame.month + 1,
    timeFrame.year,
    { onError }
  );

  const { data: expenseList, isLoading: loadingExpenses } = useExpenseBreakdown(
    timeFrame.month + 1,
    timeFrame.year,
    { onError }
  );

  const defaultFilterValue = [
    {
      name: "category",
      operator: "inlist",
      type: "select",
      value: null,
    },
  ];

  const columns = useMemo(
    () => [
      {
        name: "title",
        header: "Title",
        defaultFlex: 1,
        minWidth: 200,
        render: TitleColumn,
      },
      {
        name: "category",
        header: "Category",
        defaultFlex: 1,
        minWidth: 140,
        render: CategoryColumn,
        filterEditor: SelectFilter,
        filterEditorProps: {
          placeholder: "All",
          wrapMultiple: false,
          dataSource: Object.keys(CATEGORIES).map((c) => ({ id: c, label: c })),
        },
      },
      {
        name: "amount",
        header: "Amount",
        minWidth: 100,
        defaultFlex: 1,
        render: AmountColumn,
      },
      {
        name: "expenseDate",
        header: "Date",
        defaultFlex: 1,
        minWidth: 120,
        render: ({ value }) => dayjs(value).format("DD MMM, 'YY"),
      },
      {
        name: "_id",
        header: "",
        defaultFlex: 1,
        minWidth: 55,
        maxWidth: 55,
        render: ({ data }) =>
          MenuColumn({ data, onRevert: (e) => setRevertExpense(e) }),
      },
    ],
    []
  );

  const spentValueAndPerc = () => {
    const amount = (expenseList?.data?.response ?? []).reduce(
      (prev, curr) => prev + curr.amount,
      0
    );
    return { amount, perc: percentage(amount, budget?.data?.response?.amount) };
  };

  const { amount, perc } = spentValueAndPerc();

  return (
    <>
      <SimpleGrid cols={2}>
        <Select
          data={timeFrameOptions.months}
          value={timeFrame.month}
          size="sm"
          mb="sm"
          onChange={(month) => setTimeFrame((frame) => ({ ...frame, month }))}
        />
        <Select
          data={timeFrameOptions.years}
          value={timeFrame.year}
          onChange={(year) => setTimeFrame((frame) => ({ ...frame, year }))}
          size="sm"
          mb="sm"
        />
      </SimpleGrid>
      {loadingBudgets || loadingExpenses ? (
        <CenteredLoader />
      ) : (
        <>
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
          <ReactDataGrid
            className="mt-grid"
            theme="default-dark"
            showZebraRows={false}
            showCellBorders="horizontal"
            style={{ minHeight: "calc(100% - 80px)", minWidth: "100%" }}
            idProperty="_id"
            columns={columns}
            dataSource={[...expenseList?.data?.response] ?? []}
            columnUserSelect={true}
            columnHeaderUserSelect={false}
            showColumnMenuTool={false}
            renderPaginationToolbar={false}
            resizable={false}
            rowHeight={null}
            minRowHeight={45}
            headerHeight={45}
            enableFiltering={true}
            defaultFilterValue={defaultFilterValue}
            enableColumnFilterContextMenu={false}
            activateRowOnFocus={false}
            defaultSortInfo={[{ name: "expenseDate", dir: -1 }]}
          />
          <RevertExpense
            data={revertExpense}
            closeModal={() => setRevertExpense(null)}
            relatedQueries={[
              ["expense-breakdown", timeFrame.month + 1, timeFrame.year],
            ]}
          />
        </>
      )}
    </>
  );
}

export default TransactionsList;
