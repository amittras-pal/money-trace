import { Drawer, Modal, SimpleGrid } from "@mantine/core";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import { APP_TITLE } from "../../constants/app";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useMediaMatch } from "../../hooks/useMediaMatch";
import BudgetBreakdown from "./components/BudgetBreakdown";
import RecentTransactions from "./components/RecentTransactions";
import { useRecentTransactions } from "./services";

export default function Home() {
  const isMobile = useMediaMatch();
  useDocumentTitle(`${APP_TITLE} | Dashboard`);
  const { onError } = useErrorHandler();

  const client = useQueryClient();

  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);
  const [drawer, listDrawer] = useDisclosure(false);
  const [targetExpense, setTargetExpense] = useState(null);

  const { isLoading, data: list } = useRecentTransactions({
    refetchOnWindowFocus: false,
    onError,
  });

  const handleClose = (refreshData) => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();
    if (refreshData) {
      client.invalidateQueries({ queryKey: ["summary"] });
      client.invalidateQueries({ queryKey: ["recent-transactions"] });
    }
    setTimeout(() => {
      setTargetExpense(null);
    }, 1000);
  };

  const editExpense = (target) => {
    setTargetExpense(target);
    formModal.open();
  };

  const deleteExpense = (target) => {
    setTargetExpense(target);
    deleteModal.open();
  };

  return (
    <>
      <SimpleGrid cols={isMobile ? 1 : 2} sx={{ height: "100%" }}>
        <BudgetBreakdown
          showForm={formModal.open}
          showRecent={listDrawer.open}
          recents={list?.data?.response?.length ?? 0}
          loadingRecents={isLoading}
        />
        {!isMobile && (
          <RecentTransactions
            onEditExpense={editExpense}
            onDeleteExpense={deleteExpense}
            list={list}
            loadingList={isLoading}
          />
        )}
      </SimpleGrid>
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
      {isMobile && (
        <Drawer
          size="100%"
          position="bottom"
          opened={drawer}
          onClose={listDrawer.close}
          zIndex={199}
          title={`Recent Transactions (${list?.data?.response?.length ?? 0})`}
        >
          <RecentTransactions
            onEditExpense={editExpense}
            onDeleteExpense={deleteExpense}
            list={list}
            loadingList={isLoading}
          />
        </Drawer>
      )}
    </>
  );
}
