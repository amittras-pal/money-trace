import { Box, Divider, Group } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import AgGridMod from "../../components/ag-grid/AgGridMod";
import {
  Category,
  SubCategory,
  dateFormatter,
  RowMenu,
} from "../../components/ag-grid/utils";
import { APP_TITLE } from "../../constants/app";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import FilterAndSort from "./components/FilterAndSort";
import { useExpenseList } from "./services";

export default function Expenses() {
  useDocumentTitle(`${APP_TITLE} | Transactions`);
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
  const [payload, setPayload] = useState({
    filter: {
      startDate: dayjs().startOf("month").toDate(),
      endDate: dayjs().endOf("month").toDate(),
      categories: [],
    },
    sort: { date: -1 },
  });

  const ref = useRef();
  const { isLoading, data } = useExpenseList(payload, {
    refetchOnWondowFocus: false,
    onError,
  });

  const columns = useMemo(
    /** @returns {Array<import("ag-grid-community").ColDef>} */
    () => {
      return [
        {
          headerName: "",
          cellRenderer: RowMenu,
          cellRendererParams: {
            onEditExpense: console.log,
            onDeleteExpense: console.log,
          },
          field: "_id",
          pinned: "left",
          maxWidth: 50,
          flex: 0,
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        { headerName: "Title", field: "title", minWidth: 120 },
        {
          headerName: "Date",
          field: "date",
          sortable: true,
          initialSort: "desc",
          valueFormatter: dateFormatter,
        },
        {
          headerName: "Category",
          field: "category",
          sortable: true,
          cellRenderer: Category,
        },
        {
          headerName: "Sub Category",
          field: "subCategory",
          sortable: true,
          cellRenderer: SubCategory,
        },
      ];
    },
    []
  );

  return (
    <>
      <Group
        spacing={0}
        sx={{ flexDirection: "column", height: "100%" }}
        position="left"
        align="flex-start"
      >
        <FilterAndSort
          filter={payload.filter}
          sort={payload.sort}
          setPayload={setPayload}
        />
        <Divider my="sm" sx={{ width: "100%" }} />
        <Box sx={{ flexGrow: 1, width: "100%" }} ref={ref}>
          <AgGridMod
            height={ref.current?.clientHeight ?? 0}
            columnDefs={columns}
            rowData={data?.data?.response?.data ?? []}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </Box>
      </Group>
    </>
  );
}
