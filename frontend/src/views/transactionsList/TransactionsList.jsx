import ReactDataGrid from "@inovua/reactdatagrid-community";
import filter from "@inovua/reactdatagrid-community/filter";
import "@inovua/reactdatagrid-community/index.css";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import { Select, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import { CATEGORIES } from "../../constants/app.constants";
import { useAuth } from "../../context/UserContext";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useBudget } from "../../services/budget.service";
import { useExpenseBreakdown } from "../../services/expense.service";
import "../../theme/table-style.css";
import {
  getMonthsList,
  percentage,
  severityColor,
} from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";
import RevertExpense from "../../components/revertExpense/RevertExpense";
import {
  AmountColumn,
  AmountColumnHeader,
  CategoryColumn,
  MenuColumn,
  TitleColumn,
} from "./renderers";

function TransactionsList() {
  const { onError } = useErrorHandler();
  const { userData } = useAuth();
  const [frame, setFrame] = useState(dayjs().format("YYYY-MM-DD"));
  const [revertExpense, setRevertExpense] = useState(null);
  const [appliedFilter, setAppliedFilter] = useState({
    name: "category",
    operator: "inlist",
    type: "select",
    value: null,
  });

  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const monthOptions = useMemo(
    () => getMonthsList(userData?.createdAt),
    [userData?.createdAt]
  );

  const { data: budget, isLoading: loadingBudgets } = useBudget(
    dayjs(frame).month() + 1,
    dayjs(frame).year(),
    { onError }
  );

  const { data: expenseList, isLoading: loadingExpenses } = useExpenseBreakdown(
    dayjs(frame).month() + 1,
    dayjs(frame).year(),
    { onError }
  );

  const tableData = useMemo(() => {
    const originalSource = expenseList?.data?.response ?? [];
    if (!appliedFilter.value) return originalSource;
    else return filter(originalSource, [appliedFilter]);
  }, [appliedFilter, expenseList?.data?.response]);

  const columns = useMemo(
    () => [
      {
        name: "title",
        header: "Title",
        defaultFlex: 1,
        minWidth: 200,
        type: "string",
        render: TitleColumn,
      },
      {
        name: "category",
        header: "Category",
        defaultFlex: 1,
        minWidth: 140,
        type: "string",
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
        header: (props) => AmountColumnHeader({ ...props, appliedFilter }),
        minWidth: 100,
        defaultFlex: 1,
        type: "number",
        render: AmountColumn,
      },
      {
        name: "expenseDate",
        header: "Date",
        defaultFlex: 1,
        minWidth: 120,
        type: "string",
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
    [appliedFilter]
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
      <SimpleGrid cols={isMobile ? 1 : 3}>
        <Select
          data={monthOptions}
          onChange={setFrame}
          value={frame}
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
            // render
            style={{ minHeight: "calc(100% - 80px)", minWidth: "100%" }}
            className="mt-grid"
            theme="default-dark"
            showZebraRows={false}
            showCellBorders="horizontal"
            minRowHeight={45}
            headerHeight={45}
            resizable={false}
            rowHeight={null}
            showColumnMenuTool={false}
            activateRowOnFocus={false}
            columnUserSelect={true}
            columnHeaderUserSelect={false}
            renderPaginationToolbar={false}
            // data
            columns={columns}
            dataSource={tableData}
            idProperty="_id"
            // sorting
            defaultSortInfo={{ name: "expenseDate", type: "string", dir: -1 }}
            // filtering
            filterable={true}
            enableFiltering={true}
            filterValue={[appliedFilter]}
            enableColumnFilterContextMenu={false}
            onFilterValueChange={([v]) => setAppliedFilter(v)}
          />
          <RevertExpense
            data={revertExpense}
            closeModal={() => setRevertExpense(null)}
            relatedQueries={[
              [
                "expense-breakdown",
                dayjs(frame).month() + 1,
                dayjs(frame).year(),
              ],
            ]}
          />
        </>
      )}
    </>
  );
}

export default TransactionsList;
