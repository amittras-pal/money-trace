import { Button } from "@mantine/core";
import { Plus } from "tabler-icons-react";

function NewExpense() {
  return (
    <Button
      size="xs"
      leftIcon={<Plus size={16} />}
      color="indigo"
      variant="filled">
      Add New
    </Button>
  );
}

export default NewExpense;
