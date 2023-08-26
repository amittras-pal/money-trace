import {
  ActionIcon,
  Box,
  Group,
  LoadingOverlay,
  Notification,
  Portal,
  Text,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react";
import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AgGridMod from "../../../components/ag-grid/AgGridMod";
import {
  AmountCell,
  CategoryCell,
  MetaCell,
  MetaHeader,
  RowCountHeader,
  RowMenuCell,
} from "../../../components/ag-grid/plugins/components";
import {
  CategoryFilter,
  SubCategoryFilter,
} from "../../../components/ag-grid/plugins/filters";
import { dateFormatter } from "../../../components/ag-grid/plugins/formatters";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import { useExpenseList } from "../../expenses/services";
import { useCopyToBudget } from "../services";

export default function PlanExpensesList({ onExpenseAction, plan }) {
  const { onError } = useErrorHandler();
  const { classes } = useStyles();
  const [selection, setSelection] = useState([]);
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

  const clearSelection = () => {
    setSelection([]);
    grid.api.deselectAll();
  };

  const {
    data: listRes,
    isLoading: loadingList,
    refetch,
  } = useExpenseList(payload, {
    refetchOnWindowFocus: false,
    onSuccess: () => {
      grid?.api.destroyFilter("category.group");
      grid?.api.destroyFilter("category._id");
    },
    onError,
  });

  const { mutate: copy, isLoading: copying } = useCopyToBudget({
    onError,
    onSuccess: (res) => {
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
      clearSelection();
      refetch();
    },
  });

  const columns = useMemo(
    /** @returns {Array<import("ag-grid-community").ColDef>} */
    () => {
      return [
        {
          headerName: "",
          field: "_id",
          maxWidth: 50,
          hide: plan.open,
          pinned: "left",
          headerClass: "no-pad",
          cellStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          checkboxSelection: true,
          headerCheckboxSelection: true,
        },
        {
          headerName: "",
          headerComponent: RowCountHeader,
          cellRenderer: RowMenuCell,
          hide: !plan.open,
          cellRendererParams: {
            onEditExpense: (data) => onExpenseAction(data, "edit"),
            onDeleteExpense: (data) => onExpenseAction(data, "delete"),
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
          cellRenderer: MetaCell,
          cellRendererParams: { page: "plan" },
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
    [isMobile, onExpenseAction, plan]
  );

  return (
    <>
      <LoadingOverlay visible={loadingList} />
      <Box ref={ref} sx={{ height: "100%" }}>
        <AgGridMod
          columnDefs={columns}
          popupParent={document.body}
          height={ref.current?.clientHeight ?? 0}
          rowData={listRes?.data?.response ?? []}
          onGridReady={setGrid}
          rowSelection="multiple"
          isRowSelectable={(e) => !e.data?.linked}
          onRowSelected={({ api }) => {
            const selectedExpenses = api
              .getSelectedNodes()
              ?.map((row) => row.data._id);
            setSelection(selectedExpenses);
          }}
          suppressRowClickSelection
          noRowsOverlayComponentParams={{
            message: `No expenses recorded for this expense plan`,
          }}
        />
      </Box>
      {selection.length > 0 && (
        <Portal target={document.body} className={classes.wrapper}>
          <Notification
            sx={{ maxWidth: "95%" }}
            withCloseButton={false}
            title={`Copy ${selection.length} expenses to monthly budget.`}
            onClose={clearSelection}
          >
            <Group position="apart" spacing={8} noWrap>
              <Text>
                <Text size="xs" color="dimmed" mt={6} component="span">
                  Expenses will be copied to monthly budget at creation date.{" "}
                </Text>
                {!isMobile && <br />}
                <Text size="xs" color="red" component="span">
                  Copied expenses cannot be modified!
                </Text>
              </Text>
              <Box>
                <ActionIcon
                  color="green"
                  variant="filled"
                  radius="sm"
                  mb={6}
                  loading={copying}
                  onClick={() => copy({ expenses: selection })}
                >
                  <IconCopy size={14} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  variant="filled"
                  radius="sm"
                  onClick={() => {
                    setSelection([]);
                    grid.api.deselectAll();
                  }}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Box>
            </Group>
          </Notification>
        </Portal>
      )}
    </>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "fixed",
    width: "100%",
    maxWidth: "100%",
    top: "10px",
    display: "flex",
    justifyContent: "center",
    zIndex: 1000,
  },
}));
