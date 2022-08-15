import { ActionIcon, Box, Drawer, Group, Image, Text } from "@mantine/core";
import React, { useState } from "react";
import { ChevronUp } from "tabler-icons-react";
import ExpensesList from "../../components/expensesList/ExpensesList";
import { useLast2DaysExpenses } from "../../queries/expense.query";
import noTransactions from "../../resources/illustrations/NoTransactions.svg";

function Last2Days() {
  const [opened, setOpened] = useState(false);
  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[9],
          padding: theme.spacing.md,
          borderRadius: `${theme.radius.md}px ${theme.radius.md}px 0px 0px`,
          boxShadow: theme.shadows.lg,
          position: "absolute",
          bottom: "0",
          width: `calc(100% - ${theme.spacing.sm * 2}px)`,
          display: "flex",
          alignItems: "center",
        })}>
        <Text mr={4}>Last 2 days' transactions</Text>
        {!isLoading && (
          <Text weight="bold" mr="auto">
            ({last2Days?.data?.response?.length})
          </Text>
        )}
        {!isLoading && last2Days?.data?.response?.length > 0 && (
          <ActionIcon
            variant="light"
            color="gray"
            size="sm"
            radius="xl"
            onClick={() => setOpened(true)}>
            <ChevronUp size={16} />
          </ActionIcon>
        )}
      </Box>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={199}
        title={`Last 2 days' Transactions (${last2Days?.data?.response?.length})`}
        padding="md"
        size="xl"
        position="bottom">
        {last2Days?.data?.response?.length > 0 ? (
          <ExpensesList
            height="calc(100% - 50px)"
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
          <Group
            direction="column"
            sx={() => ({ height: "100%", justifyContent: "center" })}
            spacing={12}
            align="center">
            <Image src={noTransactions} width={150} />
            <Text color="dimmed" size="sm" align="center">
              No Transactions in the last 2 days.
            </Text>
          </Group>
        )}
      </Drawer>
    </>
  );
}

export default Last2Days;
