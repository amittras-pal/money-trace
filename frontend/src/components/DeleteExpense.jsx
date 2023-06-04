import {
  Box,
  Button,
  Divider,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useDeleteExpense } from "../modules/home/services";
import ExpenseCard from "./ExpenseCard";

export default function DeleteExpense({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { onError } = useErrorHandler();

  const { mutate: deleteExpense, isLoading: deleting } = useDeleteExpense({
    onSuccess: (res) => {
      onComplete(true);
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError,
  });

  return (
    <Box>
      <Text c={primaryColor}>
        Are you sure you want to delete the following expense?
      </Text>
      <Divider my="md" />
      <ExpenseCard hideMenu data={data} />
      <Text color="red" fz="sm" fw="bold">
        This action cannot be undone!
      </Text>
      <Group grow mt="lg">
        <Button
          variant="outline"
          onClick={() => onComplete(null)}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button onClick={() => deleteExpense(data._id)} loading={deleting}>
          Delete
        </Button>
      </Group>
    </Box>
  );
}
