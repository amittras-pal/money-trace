import {
  Box,
  Button,
  Divider,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useRevertExpense } from "../modules/home/services";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import ExpenseCard from "./ExpenseCard";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  revertMsg: yup
    .string()
    .required("Revert Message is required.")
    .max(80, "Revert Message should be less than 80 characters long."),
});

export default function RevertExpense({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { onError } = useErrorHandler();

  const { mutate: revertExpense, isLoading: reverting } = useRevertExpense({
    onSuccess: (res) => {
      onComplete(true);
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    resolver: yupResolver(schema),
    defaultValues: {
      revertMsg: "",
    },
  });

  const handleClose = () => {
    onComplete(null);
    reset();
  };

  const handleSave = (values) => {
    const payload = { id: data._id, revertMsg: values.revertMsg };
    revertExpense(payload);
  };

  return (
    <Box
      component="form"
      onReset={handleClose}
      onSubmit={handleSubmit(handleSave)}
    >
      <Text c={primaryColor}>
        Are you sure you want to revert the following expense?
      </Text>
      <Divider my="sm" />
      <ExpenseCard hideMenu data={data} />
      <TextInput
        required
        label="Revert Message"
        description="Briefly describe why this expense was reverted."
        {...register("revertMsg")}
      />
      <Text color="red" fz="sm" fw="bold">
        This action cannot be undone!
      </Text>
      <Group grow mt="lg">
        <Button
          type="button"
          variant="outline"
          onClick={() => onComplete(null)}
          disabled={reverting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={reverting} disabled={!isValid}>
          Revert
        </Button>
      </Group>
    </Box>
  );
}
