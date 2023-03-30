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
      list={list}
      onEditExpense={onEditExpense}
      onDeleteExpense={onDeleteExpense}
    />
  ) : (
    <Box className={classes.listWrapper}>
      <Text fw="bold">
        Recent Transactions ({list?.data?.response?.data?.length ?? 0})
      </Text>
      <Divider my="xs" />
      <ScrollArea h="calc(100vh - 152px)">
        <ItemList
          list={list}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      </ScrollArea>
    </Box>
  );
}

function ItemList({ list, onEditExpense, onDeleteExpense }) {
  return list.data?.response?.data?.length > 0
    ? list?.data?.response?.data?.map?.((exp) => (
        <ExpenseCard
          key={exp._id}
          data={exp}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      ))
    : "No Expenses";
}
