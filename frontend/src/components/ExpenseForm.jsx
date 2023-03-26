import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "../constants/categories";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useCreateExpense, useEditExpense } from "../modules/home/services";
import { expenseSchema } from "../modules/home/utils";

export default function ExpenseForm({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { onError } = useErrorHandler();
  const client = useQueryClient();

  const handleClose = () => {
    onComplete();
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      title: data ? data.title : "",
      description: data ? data.description : "",
      amount: data ? data.amount : "",
      category: data ? data.category : "",
      subCategory: data ? data.subCategory : "",
      catValue: data ? `${data.category}:${data.subCategory}` : "",
      date: data ? dayjs(data.date).toDate() : dayjs().toDate(),
    },
    resolver: yupResolver(expenseSchema),
  });

  const setFieldValue = (name, value) => {
    setValue(name, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSuccess = (res) => {
    handleClose();
    notifications.show({
      message: res.data?.message,
      color: "green",
      icon: <IconCheck />,
    });
    client.invalidateQueries({ queryKey: ["summary"] });
    client.invalidateQueries({ queryKey: ["recent-transactions"] });
  };

  const { mutate: createExpense, isLoading: creating } = useCreateExpense({
    onSuccess: handleSuccess,
    onError,
  });

  const { mutate: editExpense, isLoading: editing } = useEditExpense({
    onSuccess: handleSuccess,
    onError,
  });

  const handleSave = (values) => {
    const payload = Object.assign({}, values);
    delete payload.catValue;
    if (data) {
      editExpense({ ...payload, _id: data._id });
    } else createExpense(payload);
  };

  return (
    <Box
      component="form"
      onReset={handleClose}
      onSubmit={handleSubmit(handleSave)}
    >
      <Text fz="lg" fw="bold" c={primaryColor} mb="sm">
        Add a new Expense
      </Text>
      <Divider />
      <Box>
        <TextInput
          {...register("title")}
          error={errors?.title?.message}
          placeholder="Expense Title"
          label="Expense Title"
          required
        />
        <Textarea
          {...register("description")}
          placeholder="Expense Description"
          label="Expense Description"
          error={errors.description?.message}
          minRows={5}
        />
        <TextInput
          {...register("amount")}
          error={errors?.amount?.message}
          placeholder="Amount"
          label="Amount"
          inputMode="numeric"
          required
        />
        <Select
          searchable
          label="Category"
          placeholder="Pick a category"
          data={getCategories()}
          value={watch("catValue")}
          error={errors.catValue?.message}
          onChange={(e) => {
            const [category, subCategory] = e.split(":");
            setFieldValue("category", category);
            setFieldValue("subCategory", subCategory);
            setFieldValue("catValue", e);
          }}
        />
        <DateTimePicker
          label="Expense Date"
          placeholder="Select Date"
          minDate={dayjs().subtract(6, "days").toDate()}
          maxDate={new Date()}
          value={watch("date")}
          onChange={(e) => setFieldValue("date", e)}
          error={errors.date?.message}
        />
      </Box>
      <Group grow>
        <Button type="reset" variant="outline" disabled={creating || editing}>
          Cancel
        </Button>
        <Button type="submit" loading={creating || editing} disabled={!isValid}>
          Save
        </Button>
      </Group>
    </Box>
  );
}
