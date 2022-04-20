import { Box, Divider, Group, Modal, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Check, Trash, X } from "tabler-icons-react";
import LoaderOverlay from "../../../../components/LoaderOverlay";
import {
  useDeleteExpense,
  useLast2DaysExpenses,
} from "../../../../queries/expense.query";
import { nonAuthErrorHandler } from "../../../../utils/app.utils";
import ExpenseForm from "../ExpenseForm";
import ExpenseCard from "./ExpenseCard";

function LastTwoDays() {
  const { data: last2Days, isLoading } = useLast2DaysExpenses();
  const client = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);

  const { openConfirmModal, closeModal } = useModals();
  const { showNotification } = useNotifications();

  const { mutate: deleteExpense } = useDeleteExpense({
    onSuccess: ({ data }) => {
      client.invalidateQueries([
        "expense-summary",
        new Date().getMonth() + 1,
        new Date().getFullYear(),
      ]);
      client.invalidateQueries("last-two-days");
      closeModal();
      showNotification({
        title: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: (err) => {
      nonAuthErrorHandler(err, () => {
        showNotification({
          title: err.response.message,
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
      // sx: (theme) => ({ backgroundColor: theme.colors.gray[4] }),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { leftIcon: <Trash />, size: "sm", color: "red" },
      cancelProps: { leftIcon: <X />, size: "sm", color: "gray" },
      withCloseButton: false,
      onConfirm: () => {
        deleteExpense(item._id);
      },
    });
  };

  if (isLoading)
    return (
      <Group position="center" py={32}>
        <LoaderOverlay />
      </Group>
    );

  return (
    <>
      <Box mt="md">
        <Text weight={500} color="indigo" mb={0}>
          Expenses from last 2 days.
        </Text>
        <Divider variant="dashed" color="indigo" my="md" />
        {last2Days.data.response.map((expense) => (
          <ExpenseCard
            data={expense}
            key={expense._id}
            onEdit={setSelectedItem}
            onDelete={confirmDelete}
          />
        ))}
      </Box>
      <Modal
        opened={selectedItem}
        onClose={() => setSelectedItem(null)}
        withCloseButton={false}>
        <ExpenseForm
          onComplete={() => setSelectedItem(null)}
          onCancel={() => setSelectedItem(null)}
          data={selectedItem}
        />
      </Modal>
    </>
  );
}

export default LastTwoDays;
