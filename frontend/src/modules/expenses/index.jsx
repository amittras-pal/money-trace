import { Box, Divider, Group, Text } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AgGridMod from "../../components/ag-grid/AgGridMod";
import {
  Category,
  dateFormatter,
  Description,
  DescriptionHeader,
  RowMenu,
} from "../../components/ag-grid/utils";
import CategoryFilter from "../../components/ag-grid/utils/CategoryFilter";
import { APP_TITLE } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import { formatCurrency } from "../../utils";
import { useExpenseList } from "./services";

export default function Expenses() {
  useDocumentTitle(`${APP_TITLE} | Transactions`);
  const { userData } = useCurrentUser();
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
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
        message: "For best experience, use this view on a desktop computer!",
        icon: <IconInfoCircle />,
        color: "blue",
      });

    return () => {
      notifications.hide("device-info");
    };
  }, [isMobile]);

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
          minWidth: 320,
          cellRenderer: Category,
          filter: CategoryFilter,
        },
        {
          headerName: "Amount",
          field: "amount",
          minWidth: 120,
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
    [isMobile]
  );

  const updateFilterTotal = (e) => {
    let total = 0;
    let rows = 0;
    e.api.forEachNodeAfterFilter((node) => {
      total += node.data.amount;
      rows++;
    });
    setFilterTotal(rows === data?.data?.response?.data?.length ? 0 : total);
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
            Filter Total:{" "}
            {filterTotal > 0 ? formatCurrency(filterTotal) : "N.A."}
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
    </>
  );
}
