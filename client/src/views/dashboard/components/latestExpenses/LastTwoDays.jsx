import { Box, Divider, Group, Text } from "@mantine/core";
import LoaderOverlay from "../../../../components/LoaderOverlay";
import { useLast2DaysExpenses } from "../../../../queries/expense.query";
import ExpenseCard from "./ExpenseCard";

function LastTwoDays() {
  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  if (isLoading)
    return (
      <Group position="center" py={32}>
        <LoaderOverlay />
      </Group>
    );

  return (
    <Box mt="md">
      <Text weight={500} color="indigo" mb={0}>
        Expenses from last 2 days.
      </Text>
      <Divider variant="dashed" color="indigo" my="md" />
      {last2Days.data.response.map((expense) => (
        <ExpenseCard data={expense} key={expense._id} />
      ))}
    </Box>
  );
}

export default LastTwoDays;
