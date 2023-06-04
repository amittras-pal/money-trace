import {
  Box,
  Button,
  Divider,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useDeletePlan } from "../services";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import ExpensePlan from "./ExpensePlan";

export default function DeletePlan({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { onError } = useErrorHandler();

  const { mutate: deletePlan, isLoading: deleting } = useDeletePlan({
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
        Are you sure you want to delete the following expense plan?
      </Text>
      <Divider my="md" />
      <ExpensePlan data={data} hideMenu />
      <Divider my="md" />
      <Text color="red">
        This action will delete all expenses added to this plan.
      </Text>
      <Text color="red" fw="bold">
        This action cannot be undone.
      </Text>
      <Group grow mt="md">
        <Button
          variant="outline"
          onClick={() => onComplete(null)}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button onClick={() => deletePlan(data._id)} loading={deleting}>
          Delete
        </Button>
      </Group>
    </Box>
  );
}
