import { Grid, Text } from "@mantine/core";
import React from "react";
import ExpenseCard from "../../../components/ExpenseCard";
import ExpenseListSkeleton from "../../../components/ExpenseListSkeleton";
import { useRecentTransactions } from "../services";

export default function RecentTransactions({ onEditExpense, onDeleteExpense }) {
  const { isLoading, data: list } = useRecentTransactions({
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Text
        fw="bold"
        color="orange"
        sx={(theme) => ({
          position: "sticky",
          top: "50px",
          backgroundColor: theme.colors.dark[7],
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
        })}
      >
        Recent Transactions ({list?.data?.response?.data?.length ?? 0})
      </Text>
      <Grid gutter={6}>
        {isLoading ? (
          <ExpenseListSkeleton />
        ) : (
          <>
            {list.data?.response?.data?.length > 0
              ? list?.data?.response?.data?.map?.((exp) => (
                  <ExpenseCard
                    key={exp._id}
                    data={exp}
                    onEditExpense={onEditExpense}
                    onDeleteExpense={onDeleteExpense}
                  />
                ))
              : "No Expenses"}
          </>
        )}
      </Grid>
    </>
  );
}
