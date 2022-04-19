import { Button, Divider, Group, Select, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { Check, DeviceFloppy, X } from "tabler-icons-react";
import { CATEGORIES } from "../../../constants/appConstants";
import * as yup from "yup";
import { forwardRef } from "react";
import { useCreateExpense } from "../../../queries/expense.query";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { nonAuthErrorHandler } from "../../../utils/app.utils";

function ExpenseForm({ onCancel, onComplete, data = null }) {
  const { showNotification } = useNotifications();

  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    client.invalidateQueries([
      "expense-summary",
      new Date().getMonth() + 1,
      new Date().getFullYear(),
    ]);
    client.invalidateQueries("last-two-days");
    showNotification({
      title: data.message,
      color: "green",
      icon: <Check />,
    });
    onComplete();
  };

  const onError = (err) => {
    nonAuthErrorHandler(err, () => {
      showNotification({
        title: err.response.message,
        color: "red",
        icon: <X />,
      });
    });
  };

  const { mutate: addExpense, isLoading: addingExpense } = useCreateExpense({
    onSuccess,
    onError,
  });

  const expenseForm = useForm({
    initialValues: {
      title: data?.title || "",
      description: data?.description || "",
      amount: data?.amount || 0,
      category: data?.category || "",
    },
    schema: yupResolver(
      yup.object().shape({
        title: yup
          .string()
          .max(40, "Title should be 40 characters or less.")
          .required("Expense title is required."),
        description: yup
          .string()
          .max(260, "Description should be 260 characters or less."),
        category: yup.string().required("Category is required"),
        amount: yup
          .number()
          .min(1, "Amount is required.")
          .required("Amount is required."),
      })
    ),
  });

  const saveExpense = (values) => {
    if (!data) {
      addExpense(values);
    }
  };

  const SelectItem = forwardRef(({ value, ...other }, ref) => (
    <Group
      {...other}
      ref={ref}
      direction="column"
      spacing={0}
      py={6}
      pr={6}
      pl={16}
      sx={(theme) => ({
        marginBottom: 4,
        position: "relative",
        "&:before": {
          content: "''",
          height: "85%",
          width: 4,
          borderRadius: "4px",
          position: "absolute",
          top: "50%",
          left: 4,
          transform: "translateY(-50%)",
          backgroundColor: theme.colors[CATEGORIES[value].color][5],
        },
      })}>
      <Text size="sm" weight={500}>
        {value}
      </Text>
      <Text size="xs" color="dimmed">
        {CATEGORIES[value].description}
      </Text>
    </Group>
  ));

  return (
    <Group
      direction="column"
      component="form"
      noValidate
      onSubmit={expenseForm.onSubmit(saveExpense)}
      sx={{ width: "100%" }}
      grow
      spacing={0}>
      <Text color="indigo" size="lg" weight={500}>
        {data ? "Update Expense" : "Add a new Expense"}
      </Text>
      <Divider color="indigo" my={12} />
      <TextInput
        {...expenseForm.getInputProps("title")}
        size="sm"
        label="Expense Title"
        required
        placeholder="Expense Title"
        mb={12}
      />
      <TextInput
        {...expenseForm.getInputProps("description")}
        size="sm"
        label="Expense Description"
        placeholder="Expense Description"
        mb={12}
      />
      <Select
        required
        itemComponent={SelectItem}
        data={Object.keys(CATEGORIES)}
        label="Category"
        placeholder="Select Category"
        mb={12}
        {...expenseForm.getInputProps("category")}
      />
      <TextInput
        {...expenseForm.getInputProps("amount")}
        type="number"
        inputMode="numeric"
        size="sm"
        label="Expense Amount"
        required
        placeholder="Expense Amount"
        mb={12}
      />
      <Divider variant="dashed" color="indigo" mb={12} />
      <Group position="right">
        <Button
          type="button"
          size="sm"
          variant="light"
          color="indigo"
          leftIcon={<X />}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="filled"
          color="indigo"
          loading={addingExpense}
          leftIcon={<DeviceFloppy />}>
          Save
        </Button>
      </Group>
    </Group>
  );
}

export default ExpenseForm;
