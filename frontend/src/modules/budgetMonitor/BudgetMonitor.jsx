import { Box, Button, Divider, Modal, Text, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { getAuthToken } from "../../utils";
import { useBudget, useCreateBudget } from "./services";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCurrentUser } from "../../context/user";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export default function BudgetMonitor() {
  const { budget, setBudget } = useCurrentUser();
  const { onError } = useErrorHandler();
  const { isError, isLoading, refetch } = useBudget(
    {
      month: dayjs().month(),
      year: dayjs().year(),
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: Boolean(!budget && getAuthToken()),
      onError,
      onSuccess: (res) => {
        setBudget(res.data?.response?.amount);
      },
    }
  );

  const { mutate: createBudget, isLoading: creating } = useCreateBudget({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => console.log(err),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      amount: "",
      month: dayjs().month(),
      year: dayjs().year(),
    },
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .number()
          .typeError("Amount should be a number")
          .required()
          .min(1, "Budget cannot be 0"),
      })
    ),
  });

  return (
    <Modal
      opened={getAuthToken() && !budget && !isLoading && isError}
      lockScroll
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Box component="form" onSubmit={handleSubmit(createBudget)}>
        <Text mb="md">
          Your budget for the {dayjs().format("MMM, 'YY")} is not set. Please
          set a budget amount to proceed further.
        </Text>
        <Divider mb="md" />
        <TextInput
          label="Amount"
          placeholder="Amount"
          inputMode="numeric"
          {...register("amount")}
          error={errors.amount?.message}
          autoFocus
        />
        <Button type="submit" fullWidth disabled={!isValid} loading={creating}>
          Create Budget
        </Button>
      </Box>
    </Modal>
  );
}
