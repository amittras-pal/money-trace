import { Box, Divider, Modal, ScrollArea, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Check, Trash, X } from "tabler-icons-react";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useDeleteExpense } from "../../queries/expense.query";
import ExpenseCard from "../ExpenseCard";
import ExpenseForm from "../expenseForm/ExpenseForm";

function ExpensesList({
  relatedQueries,
  expenseList,
  height,
  disableExpenseActions = false,
}) {
  const client = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const { openConfirmModal, closeModal } = useModals();
  const { showNotification } = useNotifications();

  const { onError } = useErrorHandler();

  const { mutate: deleteExpense } = useDeleteExpense({
    onSuccess: ({ data }) => {
      for (const query of relatedQueries) {
        client.invalidateQueries(query);
      }
      closeModal();
      showNotification({
        title: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: (err) => {
      onError(err, () => {
        showNotification({
          title: err?.response?.data?.message,
          color: "red",
          icon: <X />,
        });
      });
    },
  });

  const confirmDelete = (item) => {
    openConfirmModal({
      title: "Delete Expense",
      children: (
        <>
          <Text size="lg" weight={700}>
            Are you sure you want to delete the following expense?
          </Text>
          <Box my={12}>
            <ExpenseCard data={item} hideMenus />
          </Box>
          <Divider variant="dashed" my="md" />
        </>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { leftIcon: <Trash />, size: "sm", color: "red" },
      cancelProps: { leftIcon: <X />, size: "sm", color: "gray" },
      withCloseButton: false,
      onConfirm: () => {
        deleteExpense(item._id);
      },
    });
  };

  return (
    <>
      <ScrollArea style={{ height }} scrollbarSize={6}>
        {expenseList?.map((expense) => (
          <ExpenseCard
            data={expense}
            key={expense._id}
            onEdit={setSelectedItem}
            onDelete={confirmDelete}
            hideMenus={disableExpenseActions}
          />
        ))}
      </ScrollArea>
      <Modal
        opened={selectedItem}
        onClose={() => setSelectedItem(null)}
        withCloseButton={false}>
        <ExpenseForm
          onComplete={() => setSelectedItem(null)}
          onCancel={() => setSelectedItem(null)}
          data={selectedItem}
          relatedQueries={relatedQueries}
        />
      </Modal>
    </>
  );
}

export default ExpensesList;
