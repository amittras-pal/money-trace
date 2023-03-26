import { Grid, Skeleton, Text } from "@mantine/core";
import React from "react";
import ExpenseCard from "../../../components/ExpenseCard";
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
      {isLoading ? (
        <>
          <Skeleton height={100} mb="sm" mt="sm" width="100%" radius="md" />
          <Skeleton height={100} mb="sm" width="100%" radius="md" />
          <Skeleton height={100} mb="sm" width="100%" radius="md" />
          <Skeleton height={100} mb="sm" width="100%" radius="md" />
        </>
      ) : (
        <>
          {list.data?.response?.data?.length > 0 ? (
            <Grid gutter={6}>
              {list?.data?.response?.data.map((exp, i, { length }) => (
                <ExpenseCard
                  key={exp._id}
                  data={exp}
                  onEditExpense={onEditExpense}
                  onDeleteExpense={onDeleteExpense}
                />
              ))}
            </Grid>
          ) : (
            "No Expenses"
          )}
        </>
      )}
    </>
  );
}
