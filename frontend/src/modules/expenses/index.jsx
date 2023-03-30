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
  Category,
  dateFormatter,
  Description,
  DescriptionHeader,
  RowMenu,
} from "../../components/ag-grid/utils";
import CategoryFilter from "../../components/ag-grid/utils/CategoryFilter";
import SubCategoryFilter from "../../components/ag-grid/utils/SubCategoryFilter";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import { APP_TITLE } from "../../constants/app";
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

  const [payload, setPayload] = useState({
    filter: {
      startDate: dayjs().startOf("month").toDate(),
      endDate: dayjs().endOf("month").toDate(),
    },
    sort: { date: -1 },
  });
  const [filterTotal, setFilterTotal] = useState(0);

  useEffect(() => {
    if (isMobile)
      notifications.show({
        id: "device-info",
        title: "Incompatible Device",
        message:
          "Some features of this view only work properly on a desktop computer!",
        autoClose: 10000,
        icon: <IconInfoCircle />,
        color: "orange",
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
          cellRenderer: RowMenu,
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
          cellRenderer: Description,
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
        { headerName: "Title", field: "title", minWidth: isMobile ? 240 : 320 },
        {
          headerName: "Category",
          field: "category",
          minWidth: 240,
          cellRenderer: Category,
          filter: CategoryFilter,
        },
        {
          headerName: "Sub Category",
          field: "subCategory",
          minWidth: 240,
          cellRenderer: Category,
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
    setPayload((prev) => ({
      ...prev,
      filter: {
        startDate: dayjs(e).startOf("month"),
        endDate: dayjs(e).endOf("month"),
      },
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
            value={payload.filter.startDate}
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
            height={ref.current?.clientHeight ?? 0}
            columnDefs={columns}
            rowData={data?.data?.response?.data ?? []}
            pagination={true}
            paginationAutoPageSize={true}
            onFilterChanged={updateFilterTotal}
            popupParent={document.body}
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
