import {
  Button,
  Checkbox,
  Divider,
  Group,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Check, DeviceFloppy, X } from "tabler-icons-react";
import * as yup from "yup";
import { CATEGORIES } from "../../constants/appConstants";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useCreateExpense, useEditExpense } from "../../queries/expense.query";
import { useReports } from "../../queries/report.query";
import { CategorySelectItem, ReportSelectItem } from "./SelectItem";

function ExpenseForm({ onCancel, onComplete, data = null, relatedQueries }) {
  const { showNotification } = useNotifications();

  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    for (const query of relatedQueries) {
      client.invalidateQueries(query);
    }
    showNotification({
      title: data.message,
      color: "green",
      icon: <Check />,
    });
    onComplete();
  };

  const { onError } = useErrorHandler();
  const handleError = (err) => {
    onError(err, () => {
      showNotification({
        title: err?.response?.data?.message,
        color: "red",
        icon: <X />,
      });
    });
  };

  const {
    data: reports,
    isLoading,
    refetch: getReports,
  } = useReports(false, { enabled: false, onError });

  const { mutate: addExpense, isLoading: addingExpense } = useCreateExpense({
    onSuccess,
    onError: handleError,
  });

  const { mutate: editExpense, isLoading: editingingExpense } = useEditExpense({
    onSuccess,
    onError: handleError,
  });

  const expenseForm = useForm({
    initialValues: {
      title: data?.title || "",
      description: data?.description || "",
      amount: data?.amount || 0,
      category: data?.category || "",
      attachToReport: data?.report ? true : false,
      report: data?.report || "",
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
        attachToReport: yup.boolean(),
        report: yup.string().when("attachToReport", {
          is: true,
          then: yup.string().required("Report name is required"),
        }),
      })
    ),
  });

  useEffect(() => {
    if (expenseForm.values.attachToReport && !reports?.data?.response) {
      getReports();
    }
    // eslint-disable-next-line
  }, [expenseForm.values.attachToReport, getReports, reports]);

  const saveExpense = (values) => {
    if (!values.attachToReport) {
      values.report = "";
    }
    if (!data) {
      addExpense(values);
    } else {
      values._id = data._id;
      editExpense(values);
    }
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
      <Select
        required
        transition="fade"
        itemComponent={CategorySelectItem}
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
      <Checkbox
        {...expenseForm.getInputProps("attachToReport")}
        checked={expenseForm.values.attachToReport}
        label="Attach to report"
        mb={12}
      />
      {expenseForm.values.attachToReport && (
        <Select
          transition="pop"
          nothingFound="You do not have any open reports."
          required
          itemComponent={ReportSelectItem}
          data={
            reports?.data?.response?.map((item) => ({
              ...item,
              value: item._id,
              label: item.name,
            })) || []
          }
          label="Report"
          placeholder={isLoading ? "Loading Reports" : "Select Report"}
          mb={12}
          {...expenseForm.getInputProps("report")}
        />
      )}
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
          loading={addingExpense || editingingExpense}
          leftIcon={<DeviceFloppy />}>
          Save
        </Button>
      </Group>
    </Group>
  );
}

export default ExpenseForm;
