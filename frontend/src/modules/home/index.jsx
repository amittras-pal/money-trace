import { Divider, Modal } from "@mantine/core";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import React, { useState } from "react";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import { APP_TITLE } from "../../constants/app";
import BudgetBreakdown from "./components/BudgetBreakdown";
import RecentTransactions from "./components/RecentTransactions";

export default function Home() {
  useDocumentTitle(`${APP_TITLE} | Dashboard`);
  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);
  const [targetExpense, setTargetExpense] = useState(null);

  const handleClose = () => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();
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
      <BudgetBreakdown setShowForm={formModal.open} />
      <Divider />
      <RecentTransactions
        onEditExpense={editExpense}
        onDeleteExpense={deleteExpense}
      />
      <Modal
        centered
        opened={showForm || confirm}
        withCloseButton={false}
        onClose={handleClose}
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
