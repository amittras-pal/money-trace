// TODO: compoenent under development
import { Box, Button, Divider, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useEditExpense } from "../modules/home/services";
import ExpenseCard from "./ExpenseCard";

export default function CopyExpense({ data, onComplete }) {
  const { onError } = useErrorHandler();

  const handleSuccess = () => {
    notifications.show({
      message: "Expense copied successfully.",
      color: "green",
      icon: <IconCheck />,
    });
    onComplete(true);
  };

  const { mutate: markExpenseCopied, isLoading: copying } = useEditExpense({
    onSuccess: handleSuccess,
    onError,
  });

  return (
    <Box>
      <Text>
        You are about to copy the following expense to your general expenses.{" "}
      </Text>
      <Text mt="sm" c="orange">
        Copied Expenses cannot be modified in the general expenses list.
      </Text>
      <Divider my="md" />
      <ExpenseCard hideMenu showAbsoluteDate data={data} />
      {dayjs(data.date) < dayjs().subtract(7, "days") && (
        <Text>
          <Text component="span" c="red" fw="bold">
            NOTE:{" "}
          </Text>{" "}
          <Text component="span">
            This expense is more than 7 days old. You will not be able to modify
            it after copy.{" "}
          </Text>
        </Text>
      )}
      <Group grow mt="lg">
        <Button
          variant="outline"
          onClick={() => onComplete(null)}
          disabled={copying}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            markExpenseCopied({ ...data, copied: true });
          }}
          loading={copying}
        >
          Copy
        </Button>
      </Group>
    </Box>
  );
}
