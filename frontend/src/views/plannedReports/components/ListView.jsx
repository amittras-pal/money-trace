import {
  Box,
  Modal,
  ScrollArea,
  Select,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import ExpenseForm from "../../../components/expenseForm/ExpenseForm";
import ExpenseItem from "../../../components/expenseItem/ExpenseItem";
import { useErrorHandler } from "../../../hooks/errorHandler";
import { useDeleteExpense } from "../../../services/expense.service";
import RevertExpense from "./RevertExpense";

export default function ListView({ data }) {
  const ref = useRef();
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [revertItem, setRevertItem] = useState(null);
  const { spacing } = useMantineTheme();
  const { id: reportId } = useParams();

  const client = useQueryClient();
  const { onError } = useErrorHandler();

  const editExpense = (data) => {
    setSelectedItem(data);
  };

  const revertExpense = (data) => {
    setRevertItem(data);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const { mutate: deleteExpense } = useDeleteExpense({
    onSuccess: ({ data }) => {
      client.invalidateQueries(["report-details", reportId]);
      closeModal();
      showNotification({
        title: data.message,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError: (err) => {
      onError(err, () => {
        showNotification({
          title: err?.response?.data?.message,
          color: "red",
          icon: <IconX />,
        });
      });
    },
  });

  useEffect(() => {
    const tileContainer = ref.current;
    if (tileContainer) {
      const tileHeight = tileContainer.getBoundingClientRect().height.toFixed();
      const paddingCompensation = spacing.sm * 2 + 4;
      const selectCompensation = 42;
      setScrollAreaHeight(
        `${tileHeight - paddingCompensation - selectCompensation}px`
      );
    }
  }, [spacing.sm]);

  const filterOptions = useMemo(() => {
    if (!data) return [];
    return data?.expenses.reduce((collected, current) => {
      if (!collected.find((item) => item.value === current.category))
        collected.push({ label: current.category, value: current.category });
      return collected;
    }, []);
  }, [data]);

  const confirmDelete = (item) => {
    openConfirmModal({
      title: "Delete Expense",
      children: (
        <>
          <Text weight={500} mb="sm">
            Are you sure you want to delete this expense?
          </Text>
          <ExpenseItem data={item} flatten hideMenus />
        </>
      ),
      labels: { confirm: "Delete", cancel: "Don't delete" },
      confirmProps: { color: "red", m: 4 },
      cancelProps: { variant: "subtle", color: "gray", m: 4 },
      withCloseButton: false,
      closeOnCancel: true,
      onConfirm: () => deleteExpense(item._id),
    });
  };

  return (
    <>
      <Box
        ref={ref}
        sx={(theme) => ({
          padding: theme.spacing.sm,
          boxShadow: theme.shadows.md,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.dark[7],
          border: `1px solid ${theme.colors.dark[5]}`,
        })}>
        <Select
          size="xs"
          mb="sm"
          onChange={setFilter}
          maxDropdownHeight={200}
          placeholder="Filter by category"
          clearable
          clearButtonTabIndex={0}
          data={filterOptions}
        />
        <ScrollArea style={{ height: scrollAreaHeight }}>
          {data?.expenses
            ?.filter((item) => (filter ? item.category === filter : true))
            ?.map((item) => (
              <ExpenseItem
                key={item._id}
                data={item}
                onDelete={confirmDelete}
                onEdit={editExpense}
                onRevert={revertExpense}
                hideMenus={!data?.report.open}
              />
            ))}
        </ScrollArea>
      </Box>
      <Modal
        opened={selectedItem ? true : false}
        title={`${selectedItem ? "Edit" : "Add New"} Expense`}
        onClose={closeModal}
        size="xl"
        withCloseButton={false}>
        <ExpenseForm
          onComplete={closeModal}
          onCancel={closeModal}
          data={selectedItem}
          relatedQueries={[["report-details", reportId]]}
        />
      </Modal>
      <RevertExpense
        data={revertItem}
        closeModal={() => setRevertItem(null)}
        relatedQueries={[["report-details", reportId]]}
      />
    </>
  );
}
