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
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "../context/user";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useCreateExpense, useEditExpense } from "../modules/home/services";
import { expenseSchema } from "../modules/home/utils";
import { useCategories } from "../services/categories";
import CategorySelectItem from "./CategorySelectItem";

export default function ExpenseForm({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { userData } = useCurrentUser();
  const { onError } = useErrorHandler();

  const minDate = useMemo(() => {
    const userDate = dayjs(userData.createdAt).toDate().getTime();
    const oldestAllowed = dayjs().subtract(6, "days").toDate().getTime();
    return dayjs(Math.max(userDate, oldestAllowed)).toDate();
  }, [userData]);

  const handleClose = () => {
    onComplete(null);
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
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      title: data ? data.title : "",
      description: data ? data.description : "",
      amount: data ? data.amount : "",
      categoryId: data ? data.categoryId : "",
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
    notifications.show({
      message: res.data?.message,
      color: "green",
      icon: <IconCheck />,
    });
    onComplete(res.data?.response);
    reset();
  };

  const { isLoading, data: categoryRes } = useCategories();

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
        {data ? "Edit Expense" : "Add a new Expense"}
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
          placeholder={isLoading ? "Loading Categories" : "Pick a category"}
          disabled={isLoading}
          value={watch("categoryId")}
          error={errors.categoryId?.message}
          onChange={(e) => setFieldValue("categoryId", e)}
          itemComponent={CategorySelectItem}
          data={
            categoryRes?.data?.response?.map((cat) => ({
              ...cat,
              value: cat._id,
            })) ?? []
          }
        />
        <DateTimePicker
          label="Expense Date"
          placeholder="Select Date"
          minDate={minDate}
          maxDate={dayjs().add(5, "min").toDate()}
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
