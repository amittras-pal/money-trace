import { Button, Group } from "@mantine/core";
import React from "react";
import { Plus } from "tabler-icons-react";

function NewExpense() {
  return (
    <Group position="center" mt="md">
      <Button
        size="lg"
        variant="filled"
        color="indigo"
        radius="md"
        leftIcon={<Plus />}>
        Add New Expense
      </Button>
    </Group>
  );
}

export default NewExpense;
