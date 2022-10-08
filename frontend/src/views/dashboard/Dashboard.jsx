import {
  ActionIcon,
  Box,
  createStyles,
  Drawer,
  Modal,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconChevronUp, IconX } from "@tabler/icons";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import ExpenseForm from "../../components/expenseForm/ExpenseForm";
import ExpenseItem from "../../components/expenseItem/ExpenseItem";
import { DASHBOARD_QUERIES } from "../../constants/app.constants";
import { useErrorHandler } from "../../hooks/errorHandler";
import {
  useDeleteExpense,
  useLast2DaysExpenses,
} from "../../services/expense.service";
import Last2DaysList from "./Last2DaysList";
import Summary from "./Summary";

function Dashboard() {
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const { classes } = useDashboardStyles({ isMobile });
  const { openConfirmModal } = useModals();

  const client = useQueryClient();
  const { onError } = useErrorHandler();

  const [openList, setOpenList] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { mutate: deleteExpense } = useDeleteExpense({
    onSuccess: ({ data }) => {
      for (const query of DASHBOARD_QUERIES) client.invalidateQueries(query);
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

  const closeModal = () => {
    if (selectedItem) setSelectedItem(null);
    setOpenForm(false);
  };

  //TODO: Try moving this within the list component.
  const editExpense = (data) => {
    setSelectedItem(data);
    setOpenForm(true);
  };

  const confirmDelete = (item) => {
    openConfirmModal({
      title: "Delete Expense",
      children: (
        <Box m={4}>
          <Text weight={500} mb="sm">
            Are you sure you want to delete this expense?
          </Text>
          <ExpenseItem data={item} flatten hideMenus />
        </Box>
      ),
      labels: { confirm: "Delete", cancel: "Don't delete" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "subtle", color: "gray" },
      withCloseButton: false,
      closeOnCancel: true,
      onConfirm: () => deleteExpense(item._id),
    });
  };

  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  return (
    <>
      <SimpleGrid cols={isMobile ? 1 : 2}>
        <Box className={classes.chartWrapper}>
          <Summary onAddNew={() => setOpenForm(true)} />
        </Box>
        {isMobile ? (
          <Box className={classes.miniTile}>
            <Text weight={500}>
              Last 2 Day's Expenses ({last2Days?.data?.response?.length})
            </Text>
            {last2Days?.data?.response?.length > 0 && (
              <ActionIcon
                size="lg"
                variant="light"
                color="dark"
                radius="xl"
                onClick={() => setOpenList(true)}>
                <IconChevronUp size={20} />
              </ActionIcon>
            )}
          </Box>
        ) : (
          <Box className={classes.tile}>
            <Last2DaysList
              onEditExpense={editExpense}
              onDeleteExpense={confirmDelete}
              data={last2Days?.data?.response}
              loading={isLoading}
            />
          </Box>
        )}
      </SimpleGrid>
      {isMobile && (
        <Drawer
          opened={openList}
          onClose={() => setOpenList(false)}
          withCloseButton
          padding="md"
          title={`Last 2 Day's Expenses (${last2Days?.data?.response?.length})`}
          position="bottom"
          size="xl">
          <Last2DaysList
            onEditExpense={editExpense}
            onDeleteExpense={confirmDelete}
            data={last2Days?.data?.response}
            loading={isLoading}
            inDrawer
          />
        </Drawer>
      )}
      <Modal
        opened={openForm}
        // TODO: Make this a conditional title
        title={`${selectedItem ? "Edit" : "Add New"} Expense`}
        onClose={closeModal}
        size="xl"
        withCloseButton={false}>
        <ExpenseForm
          onComplete={closeModal}
          onCancel={closeModal}
          data={selectedItem}
          relatedQueries={DASHBOARD_QUERIES}
        />
      </Modal>
    </>
  );
}

const useDashboardStyles = createStyles((theme, { isMobile }) => {
  return {
    chartWrapper: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      display: "flex",
      flexDirection: "column",
      height: isMobile ? "calc(100vh - 212px)" : "calc(100vh - 122px)",
    },
    tile: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      height: isMobile ? "calc(100vh - 212px)" : "calc(100vh - 122px)",
    },
    miniTile: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      height: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };
});

export default Dashboard;
