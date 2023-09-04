import {
  Box,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Text,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useDisclosure, useDocumentTitle, useHotkeys } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useRef, useState } from "react";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import AgGridMod from "../../components/ag-grid/AgGridMod";
import {
  AmountCell,
  CategoryCell,
  MetaCell,
  MetaHeader,
  RowCountHeader,
  RowMenuCell,
} from "../../components/ag-grid/plugins/components";
import {
  CategoryFilter,
  SubCategoryFilter,
} from "../../components/ag-grid/plugins/filters";
import { dateFormatter } from "../../components/ag-grid/plugins/formatters";
import { APP_TITLE } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import { formatCurrency } from "../../utils";
import { useBudget } from "../budgetMonitor/services";
import { useExpenseList } from "./services";

export default function Expenses() {
  useDocumentTitle(`${APP_TITLE} | Transactions`);
  const { userData } = useCurrentUser();
  const { onError } = useErrorHandler();

  const isMobile = useMediaMatch();

  const client = useQueryClient();

  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);

  const [targetExpense, setTargetExpense] = useState(null);
  const [filterTotal, setFilterTotal] = useState(0);
  const [grid, setGrid] = useState(null);
  const [payload, setPayload] = useState({
    startDate: dayjs().startOf("month").toDate(),
    endDate: dayjs().endOf("month").toDate(),
    sort: { date: -1 },
  });

  const clearFilters = () => {
    grid?.api.destroyFilter("category.group");
    grid?.api.destroyFilter("category._id");
  };

  useHotkeys([["x", clearFilters]]);

  const ref = useRef();
  const { data: listRes, isLoading: loadingList } = useExpenseList(payload, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      clearFilters();
      setFilterTotal(
        res.data?.response
          ?.reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2)
      );
    },
    onError,
  });

  const { data: budgetRes, isLoading: loadingBudget } = useBudget({
    month: dayjs(payload.startDate).month(),
    year: dayjs(payload.startDate).year(),
  });

  const handleClose = (refreshData) => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();
    if (refreshData && typeof refreshData === "object") {
      const update = {
        ...refreshData,
        categoryId: refreshData.categoryId._id,
        category: refreshData.categoryId,
      };
      const node = grid.api?.getDisplayedRowAtIndex(targetExpense.index);
      const updatedKeys = Object.entries(node.data).reduce(
        (updatedKeys, [key, value]) => {
          if (key === "category") {
            if (update[key].group !== value.group)
              updatedKeys.push("category.group");
            if (update[key].label !== value.label)
              updatedKeys.push("category._id");
          } else if (JSON.stringify(update[key]) !== JSON.stringify(value))
            updatedKeys.push(key);
          return updatedKeys;
        },
        []
      );
      node.setData(update);
      grid.api.flashCells({ rowNodes: [node], columns: updatedKeys });
    } else if (refreshData && typeof refreshData === "boolean") {
      client.invalidateQueries(["list", payload]);
    }
    setTimeout(() => {
      setTargetExpense(null);
    }, 1000);
  };

  const editExpense = useCallback(
    (target, index) => {
      setTargetExpense({ ...target, index });
      formModal.open();
    },
    [formModal]
  );

  const deleteExpense = useCallback(
    (target) => {
      setTargetExpense(target);
      deleteModal.open();
    },
    [deleteModal]
  );

  const columns = useMemo(
    /** @returns {Array<import("ag-grid-community").ColDef>} */
    () => {
      return [
        {
          headerName: "",
          headerComponent: RowCountHeader,
          cellRenderer: RowMenuCell,
          cellRendererParams: {
            onEditExpense: editExpense,
            onDeleteExpense: deleteExpense,
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
          cellRenderer: MetaCell,
          cellRendererParams: { page: "budget" },
          headerComponent: MetaHeader,
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
          cellRenderer: AmountCell,
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
    [isMobile, deleteExpense, editExpense]
  );

  const updateFilterTotal = (grid) => {
    let total = 0;
    grid.api.forEachNodeAfterFilter((node) => {
      total += node.data.amount;
    });
    setFilterTotal(total);
  };

  const handleMonthChange = (e) => {
    setPayload((prev) => ({
      ...prev,
      startDate: dayjs(e).startOf("month"),
      endDate: dayjs(e).endOf("month"),
      sort: {
        date: -1,
      },
    }));
  };

  return (
    <>
      <Group
        spacing={0}
        sx={{ flexDirection: "column", height: "100%" }}
        position="left"
        align="flex-start"
      >
        <Group spacing="xs" sx={{ width: "100%" }}>
          <MonthPickerInput
            size="xs"
            sx={{ flex: 1, textAlign: "center" }}
            placeholder="Select month"
            variant="filled"
            value={payload.startDate}
            valueFormat="MMM 'YY"
            disabled={dayjs(userData?.createdAt).month() === dayjs().month()}
            onChange={handleMonthChange}
            maxDate={dayjs().toDate()}
            minDate={
              userData ? dayjs(userData?.createdAt).toDate() : dayjs().toDate()
            }
          />
          <Text ta="right" fw="bold" fz="xs" sx={{ flex: 3 }}>
            Total: {filterTotal > 0 ? formatCurrency(filterTotal) : "N.A."} of{" "}
            {formatCurrency(budgetRes?.data?.response?.amount ?? 0)}
          </Text>
        </Group>
        <Divider my="sm" sx={{ width: "100%" }} />
        <Box sx={{ flexGrow: 1, width: "100%" }} ref={ref}>
          <AgGridMod
            columnDefs={columns}
            popupParent={document.body}
            onFilterChanged={updateFilterTotal}
            height={ref.current?.clientHeight ?? 0}
            rowData={listRes?.data?.response ?? []}
            onGridReady={setGrid}
            noRowsOverlayComponentParams={{
              message: `No expenses recorded for ${dayjs(
                payload.startDate
              ).format("MMM, 'YY")}`,
            }}
          />
        </Box>
      </Group>
      <Modal
        centered
        opened={showForm || confirm}
        withCloseButton={false}
        onClose={handleClose}
        withOverlay
      >
        {showForm && (
          <ExpenseForm data={targetExpense} onComplete={handleClose} />
        )}
        {confirm && (
          <DeleteExpense data={targetExpense} onComplete={handleClose} />
        )}
      </Modal>
      <LoadingOverlay visible={loadingBudget || loadingList} />
    </>
  );
}
