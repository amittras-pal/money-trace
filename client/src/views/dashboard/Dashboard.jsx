import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Plus } from "tabler-icons-react";
import ExpenseSummary from "./components/ExpenseSummary";
import LastTwoDays from "./components/latestExpenses/LastTwoDays";
import ExpenseForm from "./components/ExpenseForm";

function Dashboard() {
  const { openModal, closeModal } = useModals();
  const openExpenseForm = () => {
    openModal({
      children: <ExpenseForm onComplete={closeModal} onCancel={closeModal} />,
      withCloseButton: false,
    });
  };
  return (
    <>
      <ExpenseSummary />
      <LastTwoDays />
      <ActionIcon
        onClick={openExpenseForm}
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
    </>
  );
}

export default Dashboard;
