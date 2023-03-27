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
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useDeleteExpense } from "../modules/home/services";
import ExpenseCard from "./ExpenseCard";

export default function DeleteExpense({ data, onComplete }) {
  console.log(data);
  const { primaryColor } = useMantineTheme();
  const client = useQueryClient();
  const { onError } = useErrorHandler();

  const { mutate: deleteExpense, isLoading: deleting } = useDeleteExpense({
    onSuccess: (res) => {
      onComplete();
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
      client.invalidateQueries({ queryKey: ["summary"] });
      client.invalidateQueries({ queryKey: ["recent-transactions"] });
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
        <Button variant="outline" onClick={onComplete} disabled={deleting}>
          Cancel
        </Button>
        <Button onClick={() => deleteExpense(data._id)} loading={deleting}>
          Delete
        </Button>
      </Group>
    </Box>
  );
}