import { Box, Divider, ScrollArea, Text } from "@mantine/core";
import React from "react";
import ExpenseCard from "../../../components/ExpenseCard";
import ExpenseListSkeleton from "../../../components/ExpenseListSkeleton";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import { useStyles } from "../styles";

export default function RecentTransactions({
  list,
  loadingList,
  onEditExpense,
  onDeleteExpense,
}) {
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  if (loadingList) return <ExpenseListSkeleton />;

  return isMobile ? (
    <ItemList
      list={list.data?.response}
      onEditExpense={onEditExpense}
      onDeleteExpense={onDeleteExpense}
    />
  ) : (
    <Box className={classes.listWrapper}>
      <Text fw="bold">
        Recent Transactions ({list?.data?.response?.length ?? 0})
      </Text>
      <Divider my="xs" />
      <ScrollArea h="calc(100vh - 162px)">
        <ItemList
          list={list.data?.response ?? []}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      </ScrollArea>
    </Box>
  );
}

function ItemList({ list, onEditExpense, onDeleteExpense }) {
  return list?.length > 0
    ? list.map((exp) => (
        <ExpenseCard
          key={exp._id}
          data={exp}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      ))
    : "No Expenses";
}
