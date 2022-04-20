import { Box, Divider, Group, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import ExpensesList from "../../components/expensesList/ExpensesList";
import LoaderOverlay from "../../components/LoaderOverlay";
import { useExpensesForReport } from "../../queries/expense.query";

function ReportExpenses() {
  const { id } = useParams();
  const { isLoading, data: expenses } = useExpensesForReport(id);

  return (
    <Box>
      <Text size="lg" weight={500} color="indigo">
        Expenses
      </Text>
      <Divider variant="dashed" color="indigo" my={12} />
      {isLoading ? (
        <Group sx={{ height: "400px" }} direction="column" position="center">
          <LoaderOverlay />
        </Group>
      ) : (
        <ExpensesList
          expenseList={expenses?.data?.response || []}
          relatedQueries={[["expense-for-report", id]]}
        />
      )}
    </Box>
  );
}

export default ReportExpenses;
