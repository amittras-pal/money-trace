import {
  Divider,
  Group,
  Image,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import ExpenseItem from "../../components/expenseItem/ExpenseItem";
import noTransactions from "../../resources/NoTransactions.svg";

export default function Last2DaysList({
  data,
  loading,
  inDrawer,
  onEditExpense,
  onDeleteExpense,
}) {
  const { colors } = useMantineTheme();
  if (loading) return <CenteredLoader />;

  return (
    <>
      {!inDrawer && (
        <Text color={colors.indigo[4]} weight={500}>
          Last 2 Day's Expenses
        </Text>
      )}
      <Divider my="sm" variant="dashed" color="indigo" />
      {data?.length > 0 ? (
        <ScrollArea style={{ height: "calc(100% - 50px)" }}>
          {data?.map((item) => (
            <ExpenseItem
              key={item._id}
              data={item}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </ScrollArea>
      ) : (
        <Group
          sx={() => ({
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          })}
          spacing={12}
          align="center">
          <Image src={noTransactions} width={200} />
          <Text color="dimmed" size="sm" align="center">
            No Transactions in the last 2 days.
          </Text>
        </Group>
      )}
    </>
  );
}
