import { Box, Divider, Group, Image, Text } from "@mantine/core";
import ExpensesList from "../../../../components/expensesList/ExpensesList";
import LoaderOverlay from "../../../../components/LoaderOverlay";
import { useLast2DaysExpenses } from "../../../../queries/expense.query";
import noTransactions from "../../../../resources/illustrations/NoTransactions.svg";

function LastTwoDays() {
  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  return (
    <>
      <Box mt="md">
        <Text weight={500} color="indigo" mb={0}>
          Last 2 Days' Transactions
        </Text>
        <Divider variant="dashed" color="indigo" my="md" />
        {isLoading ? (
          <Group position="center" py={32}>
            <LoaderOverlay />
          </Group>
        ) : last2Days?.data?.response?.length > 0 ? (
          <ExpensesList
            height="60vh"
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
        ) : (
          <Group direction="column" spacing={12} align="center">
            <Image src={noTransactions} width={150} />
            <Text color="dimmed" size="sm" align="center">
              No Transactions in the last 2 days.
            </Text>
          </Group>
        )}
      </Box>
    </>
  );
}

export default LastTwoDays;
