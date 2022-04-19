import { Button, Divider, Group, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { DeviceFloppy, X } from "tabler-icons-react";
import * as yup from "yup";

function ExpenseForm({ onCancel, onComplete, data }) {
  // const getMinDate = () => {
  //   const date = new Date();
  //   date.setDate(new Date().getDate() - 7);
  //   return date;
  // };

  const expenseForm = useForm({
    initialValues: {
      title: data?.title || "",
      description: data?.description || "",
      amount: data?.amount || 0,
      // olderExpense: false,
      // expenseDate: new Date(),
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
        amount: yup
          .number()
          .min(1, "Amount is required.")
          .required("Amount is required."),
      })
    ),
  });

  const saveExpense = (values) => {
    if (!values.olderExpense) delete values.expenseDate;
    delete values.olderExpense;
    console.log(values);
    onComplete();
  };

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
          leftIcon={<DeviceFloppy />}>
          Save
        </Button>
      </Group>
    </Group>
  );
}

export default ExpenseForm;
