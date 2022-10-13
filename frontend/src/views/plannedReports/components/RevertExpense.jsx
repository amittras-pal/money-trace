import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import ExpenseItem from "../../../components/expenseItem/ExpenseItem";
import { useErrorHandler } from "../../../hooks/errorHandler";
import { useRevertExpense } from "../../../services/expense.service";

export default function RevertExpense({ data, closeModal, relatedQueries }) {
  const availableMsgLength = useMemo(
    () => 256 - (data?.description?.length ?? 0),
    [data?.description?.length]
  );

  const { onError } = useErrorHandler();
  const handleError = (err) => {
    onError(err, () => {
      showNotification({
        title: err?.response?.data?.message,
        color: "red",
        icon: <IconX />,
      });
    });
  };
  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    for (const query of relatedQueries) client.invalidateQueries(query);
    showNotification({
      title: data.message,
      color: "green",
      icon: <IconCheck />,
    });
    closeModal();
  };

  const { mutate: revert, isLoading: reverting } = useRevertExpense({
    onSuccess,
    onError: handleError,
  });

  const revertForm = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      revertMsg: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        revertMsg: yup
          .string()
          .max(
            availableMsgLength,
            `Message should be ${availableMsgLength} characters or less.`
          )
          .required("Revert Message is required."),
      })
    ),
  });

  const revertExpense = (values) => {
    revert({ expenseId: data._id, revertMsg: values.revertMsg });
  };

  const cancelRevert = () => {
    revertForm.reset();
    closeModal();
  };

  return (
    <Modal
      opened={data}
      onClose={cancelRevert}
      withCloseButton={false}
      title="Revert Expense">
      <SimpleGrid
        cols={1}
        m={4}
        component="form"
        noValidate
        onSubmit={revertForm.handleSubmit(revertExpense)}
        spacing={0}>
        <Text mb="sm">
          Are you sure you want to revert the following expense?
        </Text>
        {data && <ExpenseItem data={data} hideMenus flatten />}
        <TextInput
          mb="md"
          size="sm"
          label="Revert Mesasge"
          required
          autoFocus
          placeholder="Add a Revert Message"
          {...revertForm.register("revertMsg")}
          descriptionProps={{ align: "right", mt: 4 }}
          description={`${
            revertForm.watch("revertMsg").length
          }/${availableMsgLength}`}
          error={revertForm?.formState.errors?.revertMsg?.message}
        />
        <Text size="sm" color="red" mb="md">
          This will freeze the expense for any further action. It will not be
          considered for calculating the buget.
        </Text>
        <Text weight={500} color="red">
          THIS ACTION CANNOT BE UNDONE!
        </Text>
        <Group position="right" mt="md">
          <Button
            type="button"
            size="sm"
            variant="subtle"
            color="gray"
            onClick={cancelRevert}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="filled"
            color="red"
            disabled={!revertForm.formState.isValid}
            loading={reverting}>
            Revert
          </Button>
        </Group>
      </SimpleGrid>
    </Modal>
  );
}
