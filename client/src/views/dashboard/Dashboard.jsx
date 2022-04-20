import { ActionIcon, Modal } from "@mantine/core";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import ExpenseForm from "../../components/expenseForm/ExpenseForm";
import ExpenseSummary from "./components/ExpenseSummary";
import LastTwoDays from "./components/latestExpenses/LastTwoDays";

function Dashboard() {
  const [open, setOpen] = useState(false);
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
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        withCloseButton={false}>
        <ExpenseForm
          onComplete={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Dashboard;
