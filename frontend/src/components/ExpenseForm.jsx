import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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
import { IconCheck, IconCurrencyRupee } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "../context/user";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useCreateExpense, useEditExpense } from "../modules/home/services";
import { expenseSchema } from "../modules/home/utils";
import { useCategories } from "../services/categories";
import CategorySelectItem from "./CategorySelectItem";
import { useExpensePlans } from "../modules/plans/services";
import { useParams } from "react-router-dom";

export default function ExpenseForm({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { userData } = useCurrentUser();
  const { onError } = useErrorHandler();
  const params = useParams();

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
      title: data?.title ?? "",
      description: data?.description ?? "",
      amount: data?.amount ?? 0,
      categoryId: data?.categoryId ?? "",
      date: data ? dayjs(data.date).toDate() : dayjs().toDate(),
      addToPlan: data ? Boolean(data.plan) : false,
      plan: data?.plan ?? "",
      linked: data?.linked ?? null,
    },
    resolver: yupResolver(expenseSchema()),
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
    onComplete(res.data?.response ?? true);
    reset();
  };

  const { data: categoryRes, isLoading: loadingCategories } = useCategories();
  const { data: plansRes, isLoading: loadingPlans } = useExpensePlans(true, {
    enabled: watch("addToPlan"),
    refetchOnMount: false,
    onError,
  });

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
    if (!values.plan || !values.addToPlan) payload.plan = null;
    if (data?._id) editExpense({ ...payload, _id: data._id });
    else createExpense(payload);
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
      <Divider mb="sm" />
      {data?.linked && (
        <Alert color="red" title="Linked Expense" mb="sm">
          This expense is linked to another expense, editing it will also edit
          the other one.
        </Alert>
      )}
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
          icon={<IconCurrencyRupee size={18} />}
          onBlur={(e) => {
            if (!e.target.value)
              setValue("amount", 0, {
                shouldTouch: true,
                shouldDirty: true,
                shouldValidate: true,
              });
          }}
          description={`${
            !parseInt(watch("amount"))
              ? "Keeping 0 as amount will indicate a record type expense."
              : ""
          }`}
        />
        <Select
          searchable
          required
          label="Category"
          placeholder={
            loadingCategories ? "Loading Categories" : "Pick a category"
          }
          disabled={loadingCategories}
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
          required
        />
        <Checkbox
          {...register("addToPlan")}
          label="Add to Plan"
          description={
            data?.linked && !params.id
              ? "Cannot add to plan as it a copied expense."
              : ""
          }
          mb="md"
          disabled={!!params.id || data?.linked}
        />
        {watch("addToPlan") && (
          <Select
            label="Select Plan"
            required
            placeholder={loadingPlans ? "Loading plans" : "Select Plan"}
            disabled={loadingPlans || !!params.id}
            value={watch("plan")}
            error={errors.plan?.message}
            onChange={(e) => setFieldValue("plan", e)}
            data={
              plansRes?.data?.response?.map((plan) => ({
                label: plan.name,
                value: plan._id,
              })) ?? []
            }
          />
        )}
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
