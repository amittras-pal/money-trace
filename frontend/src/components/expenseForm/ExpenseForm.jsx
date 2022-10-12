import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Divider,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconCurrencyRupee, IconX } from "@tabler/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import { CATEGORIES } from "../../constants/app.constants";
import { useErrorHandler } from "../../hooks/errorHandler";
import {
  useCreateExpense,
  useEditExpense,
} from "../../services/expense.service";
import { useReports } from "../../services/report.service";
import { CategorySelectItem, ReportSelectItem } from "./SelectItem";

export default function ExpenseForm({
  onComplete,
  onCancel,
  relatedQueries,
  data = null,
}) {
  const client = useQueryClient();
  const { onError } = useErrorHandler();

  const onSuccess = ({ data }) => {
    for (const query of relatedQueries) {
      client.invalidateQueries(query);
    }
    showNotification({
      title: data.message,
      color: "green",
      icon: <IconCheck />,
    });
    onComplete();
  };

  const handleError = (err) => {
    onError(err, () => {
      showNotification({
        title: err?.response?.data?.message,
        color: "red",
        icon: <IconX />,
      });
    });
  };

  const { mutate: addExpense, isLoading: addingExpense } = useCreateExpense({
    onSuccess,
    onError: handleError,
  });

  const { mutate: editExpense, isLoading: editingingExpense } = useEditExpense({
    onSuccess,
    onError: handleError,
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      amount: data?.amount ?? 0,
      category: data?.category ?? "",
      attachToReport: data?.report ? true : false,
      report: data?.report ?? "",
    },
    mode: "onBlur",
    shouldFocusError: true,
    resolver: yupResolver(
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
          .number("Invalid amount value.")
          .typeError("Invalid input value")
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

  const { data: reports, isLoading } = useReports(false, {
    enabled: watch("attachToReport"),
    refetchOnMount: false,
    onError,
  });

  const saveExpense = (values) => {
    if (!values.attachToReport) values.report = "";
    if (!data) addExpense(values);
    else {
      values._id = data._id;
      editExpense(values);
    }
  };

  return (
    <SimpleGrid
      cols={1}
      spacing="sm"
      component="form"
      noValidate
      m={4}
      onSubmit={handleSubmit(saveExpense)}>
      <Divider color="indigo" mb="sm" variant="dashed" />
      <TextInput
        label="Title"
        required
        autoFocus
        {...register("title")}
        error={errors.title?.message}
      />
      <Textarea
        label="Description"
        rows={4}
        {...register("description")}
        error={errors.description?.message}
      />
      <Text color="dimmed" size={12} mt={-8} align="end">
        {watch("description").length} / 260
      </Text>
      <TextInput
        type="number"
        label="Amount"
        inputMode="numeric"
        required
        icon={<IconCurrencyRupee size={18} />}
        {...register("amount")}
        error={errors.amount?.message}
      />
      <Select
        required
        transition="fade"
        itemComponent={CategorySelectItem}
        data={Object.keys(CATEGORIES)}
        label="Category"
        placeholder="Select Category"
        mb={12}
        error={errors.category?.message}
        value={watch("category")}
        onChange={(e) => {
          setValue("category", e, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }}
      />
      <Checkbox
        mb="sm"
        color="indigo"
        label="Add to planned expense."
        {...register("attachToReport")}
      />
      {watch("attachToReport") && (
        <Select
          mb={12}
          label="Report"
          transition="pop"
          disabled={isLoading}
          nothingFound="You do not have any open reports."
          placeholder={isLoading ? "Loading Reports" : "Select Report"}
          itemComponent={ReportSelectItem}
          error={errors.report?.message}
          required
          data={
            reports?.data?.response?.map((item) => ({
              ...item,
              value: item._id,
              label: item.name,
            })) || []
          }
          value={watch("report")}
          onChange={(e) => {
            setValue("report", e, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
      )}
      <SimpleGrid cols={2}>
        <Button
          type="button"
          variant="outline"
          disabled={addingExpense || editingingExpense}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={addingExpense || editingingExpense}>
          Save
        </Button>
      </SimpleGrid>
    </SimpleGrid>
  );
}
