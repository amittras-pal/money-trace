import { Box, Divider, Group, Text } from "@mantine/core";
import ExpensesList from "../../../../components/expensesList/ExpensesList";
import LoaderOverlay from "../../../../components/LoaderOverlay";
import { useLast2DaysExpenses } from "../../../../queries/expense.query";

function LastTwoDays() {
  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  return (
    <>
      <Box mt="md">
        <Text weight={500} color="indigo" mb={0}>
          Last 2 Days' Expenses
        </Text>
        <Divider variant="dashed" color="indigo" my="md" />
        {isLoading ? (
          <Group position="center" py={32}>
            <LoaderOverlay />
          </Group>
        ) : (
          <ExpensesList
            expenseList={last2Days?.data?.response || []}
            relatedQueries={[
              [
                "expense-summary",
                new Date().getMonth() + 1,
                new Date().getFullYear(),
              ],
              "last-two-days",
            ]}
          />
        )}
      </Box>
    </>
  );
}

export default LastTwoDays;
