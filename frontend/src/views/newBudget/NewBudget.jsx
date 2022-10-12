import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useAddBudget } from "../../services/budget.service";

export default function NewBudget() {
  const { onError } = useErrorHandler();
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const client = useQueryClient();

  const { mutate: saveBudget, isLoading: savingBudget } = useAddBudget({
    onSuccess: ({ data }) => {
      client.invalidateQueries([
        "budget-data",
        dayjs().month() + 1,
        dayjs().year(),
      ]);
      showNotification({
        message: data.message,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError: (err) =>
      onError(err, () => {
        showNotification({
          title: err.response?.data?.message,
          color: "red",
          icon: <IconX />,
        });
      }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm({
    defaultValues: {
      amount: 0,
      month: dayjs().month() + 1,
      year: dayjs().year(),
    },
    mode: "onChange",
    shouldFocusError: true,
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .number()
          .typeError("Invalid Amount")
          .min(1, "Amount is required.")
          .required("Amount is required."),
      })
    ),
  });

  return (
    <Modal
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      opened={true}>
      <Text size="lg">
        Budget is not set for {dayjs().format("MMMM, YYYY")}.
      </Text>
      <Text color="dimmed">
        Please set a budget for this month to continue further.
      </Text>
      <Divider variant="dashed" color="indigo" my={12} />
      <Box component="form" noValidate onSubmit={handleSubmit(saveBudget)}>
        <TextInput
          placeholder="Budget Amount"
          label="Amount"
          required
          autoFocus
          inputMode="numeric"
          {...register("amount")}
          error={
            dirtyFields.amount && touchedFields.amount && errors.amount?.message
          }
        />
        <Group position="right">
          <Button
            disabled={!isValid}
            type="submit"
            fullWidth={isSmallScreen}
            loading={savingBudget}>
            Save Budget
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
