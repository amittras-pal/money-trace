import { Box, LoadingOverlay } from "@mantine/core";
import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AgGridMod from "../../../components/ag-grid/AgGridMod";
import {
  CategoryCell,
  DescriptionCell,
  DescriptionHeader,
  ExpenseMetaCell,
  ExpenseMetaHeader,
  RowCount,
  RowMenuCell,
} from "../../../components/ag-grid/plugins/components";
import {
  CategoryFilter,
  SubCategoryFilter,
} from "../../../components/ag-grid/plugins/filters";
import { dateFormatter } from "../../../components/ag-grid/plugins/formatters";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import { formatCurrency } from "../../../utils";
import { useExpenseList } from "../../expenses/services";

export default function PlanExpensesList({ onExpenseAction, plan }) {
  const { onError } = useErrorHandler();
  const params = useParams();
  const ref = useRef();
  const isMobile = useMediaMatch();
  const [grid, setGrid] = useState(null);

  const payload = useMemo(
    () => ({
      sort: { date: -1 },
      plan: params.id,
    }),
    [params]
  );

  const { data: listRes, isLoading: loadingList } = useExpenseList(payload, {
    refetchOnWindowFocus: false,
    onSuccess: () => {
      grid?.api.destroyFilter("category.group");
      grid?.api.destroyFilter("category._id");
    },
    onError,
  });

  const columns = useMemo(
    /** @returns {Array<import("ag-grid-community").ColDef>} */
    () => {
      return [
        {
          headerName: "",
          headerComponent: RowCount,
          cellRenderer: RowMenuCell,
          cellRendererParams: {
            onEditExpense: (data) => onExpenseAction(data, "edit"),
            onDeleteExpense: (data) => onExpenseAction(data, "delete"),
            onCopyToBudget: (data) => onExpenseAction(data, "copy"),
            plan: plan,
          },
          field: "_id",
          pinned: "left",
          maxWidth: 50,
          headerClass: "no-pad",
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        {
          headerName: "Description",
          field: "description",
          maxWidth: 50,
          cellRenderer: DescriptionCell,
          headerComponent: DescriptionHeader,
          headerClass: "no-pad",
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        {
          headerName: "",
          field: "_id",
          maxWidth: 50,
          cellRenderer: ExpenseMetaCell,
          headerComponent: ExpenseMetaHeader,
          cellRendererParams: { page: "plan" },
          headerClass: "no-pad",
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        {
          headerName: "Title",
          field: "title",
          minWidth: isMobile ? 240 : 320,
        },
        {
          headerName: "Category",
          field: "category.group",
          minWidth: 240,
          cellRenderer: CategoryCell,
          filter: CategoryFilter,
        },
        {
          headerName: "Sub Category",
          colId: "category._id",
          field: "category.label",
          minWidth: 240,
          cellRenderer: CategoryCell,
          filter: SubCategoryFilter,
        },
        {
          headerName: "Amount",
          field: "amount",
          minWidth: 140,
          sortable: true,
          valueFormatter: ({ value }) => formatCurrency(value),
        },

        {
          headerName: "Date",
          field: "date",
          sortable: true,
          minWidth: 160,
          initialSort: "desc",
          valueFormatter: dateFormatter,
        },
      ];
    },
    [isMobile, onExpenseAction, plan]
  );

  return (
    <>
      <Box ref={ref} sx={{ height: "100%" }}>
        <AgGridMod
          columnDefs={columns}
          popupParent={document.body}
          height={ref.current?.clientHeight ?? 0}
          rowData={listRes?.data?.response ?? []}
          onGridReady={setGrid}
          noRowsOverlayComponentParams={{
            message: `No expenses recorded for this expense plan`,
          }}
        />
      </Box>

      <LoadingOverlay visible={loadingList} />
    </>
  );
}
