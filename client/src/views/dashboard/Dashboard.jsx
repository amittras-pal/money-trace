import { ActionIcon, Modal } from "@mantine/core";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import ExpenseForm from "../../components/expenseForm/ExpenseForm";
import ExpenseSummary from "./components/ExpenseSummary";
import LastTwoDays from "./components/latestExpenses/LastTwoDays";

function Dashboard() {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <ExpenseSummary />
      <LastTwoDays />
      <ActionIcon
        onClick={() => setOpen(true)}
        size="xl"
        color="indigo"
        variant="filled"
        radius="xl"
        sx={(theme) => ({
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
        })}>
        <Plus size={24} />
      </ActionIcon>
      <Modal opened={open} onClose={closeModal} withCloseButton={false}>
        <ExpenseForm
          onComplete={closeModal}
          onCancel={closeModal}
          relatedQueries={[
            [
              "expense-summary",
              new Date().getMonth() + 1,
              new Date().getFullYear(),
            ],
            "last-two-days",
          ]}
        />
      </Modal>
    </>
  );
}

export default Dashboard;
