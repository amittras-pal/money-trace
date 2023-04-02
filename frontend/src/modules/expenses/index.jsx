import { Box, Divider, Group, Modal, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AgGridMod from "../../components/ag-grid/AgGridMod";
import {
  CategoryCell,
  DescriptionCell,
  DescriptionColumnHeader,
  RowMenuCell,
} from "../../components/ag-grid/plugins/components";
import {
  CategoryFilter,
  SubCategoryFilter,
} from "../../components/ag-grid/plugins/filters";
import { dateFormatter } from "../../components/ag-grid/plugins/formatters";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import { formatCurrency } from "../../utils";
import { useExpenseList } from "./services";

export default function Expenses() {
  useDocumentTitle(`${APP_TITLE} | Transactions`);
  const { userData, budget } = useCurrentUser();
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);
  const [targetExpense, setTargetExpense] = useState(null);
  const client = useQueryClient();

  const [filterTotal, setFilterTotal] = useState(0);
  const [gridApi, setGridApi] = useState(null);
  const [payload, setPayload] = useState({
    startDate: dayjs().startOf("month").toDate(),
    endDate: dayjs().endOf("month").toDate(),
    sort: { date: -1 },
  });

  useEffect(() => {
    if (isMobile)
      notifications.show({
        id: "device-info",
        title: "Incompatible Device",
        message:
          "Some features of this view only work properly on a desktop computer!",
        autoClose: 10000,
        icon: <IconInfoCircle />,
        color: primaryColor,
      });

    return () => {
      notifications.hide("device-info");
    };
  }, [isMobile]);

  const ref = useRef();
  const { isLoading, data } = useExpenseList(payload, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      setFilterTotal(
        res.data?.response?.data
          ?.reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2)
      );
    },
    onError,
  });

  const handleClose = (refreshData) => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();
    if (refreshData) client.invalidateQueries(["list", payload]);
    setTimeout(() => {
      setTargetExpense(null);
    }, 1000);
  };

  const editExpense = useCallback(
    (target) => {
      setTargetExpense(target);
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
          cellRenderer: RowMenuCell,
          cellRendererParams: {
            onEditExpense: editExpense,
            onDeleteExpense: deleteExpense,
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
        {
          headerName: "Description",
          field: "description",
          maxWidth: 50,
          cellRenderer: DescriptionCell,
          headerComponent: DescriptionColumnHeader,
          headerClass: "no-pad",
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        { headerName: "Title", field: "title", minWidth: isMobile ? 240 : 320 },
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
    gridApi.api.destroyFilter("category.group");
    gridApi.api.destroyFilter("category._id");
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
        <Group grow spacing="xs" sx={{ width: "100%" }}>
          <MonthPickerInput
            size="xs"
            placeholder="Select month"
            variant="filled"
            value={payload.startDate}
            disabled={dayjs(userData?.createdAt).month() === dayjs().month()}
            onChange={handleMonthChange}
            maxDate={dayjs().toDate()}
            minDate={
              userData ? dayjs(userData?.createdAt).toDate() : dayjs().toDate()
            }
          />
          <Text ta="right" fw="bold" fz="xs">
            Total: {filterTotal > 0 ? formatCurrency(filterTotal) : "N.A."} of{" "}
            {formatCurrency(budget)}
          </Text>
        </Group>
        <Divider my="sm" sx={{ width: "100%" }} />
        <Box sx={{ flexGrow: 1, width: "100%" }} ref={ref}>
          <AgGridMod
            pagination={true}
            columnDefs={columns}
            popupParent={document.body}
            paginationAutoPageSize={true}
            onFilterChanged={updateFilterTotal}
            height={ref.current?.clientHeight ?? 0}
            rowData={data?.data?.response ?? []}
            onGridReady={setGridApi}
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
    </>
  );
}
