import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import React from "react";
import { useQueryClient } from "react-query";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import ExpenseCard from "../ExpenseCard";
import { ArrowBackUp, Check, X } from "tabler-icons-react";
import { useRevertExpense } from "../../queries/expense.query";

export default function RevertExpense({ data, closeModal, relatedQueries }) {
  const { showNotification } = useNotifications();
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
  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    for (const query of relatedQueries) client.invalidateQueries(query);
    showNotification({
      title: data.message,
      color: "green",
      icon: <Check />,
    });
    closeModal();
  };

  const { mutate: revert, isLoading: reverting } = useRevertExpense({
    onSuccess,
    onError: handleError,
  });

  const revertForm = useForm({
    initialValues: {
      revertMsg: "",
    },
    schema: yupResolver(
      yup.object().shape({
        revertMsg: yup
          .string()
          .max(40, "Message should be 40 characters or less.")
          .required("Revert Message is required."),
      })
    ),
  });

  const revertExpense = (values) => {
    revert({ expenseId: data._id, revertMsg: values.revertMsg });
  };

  return (
    <Modal
      opened={data}
      onClose={closeModal}
      withCloseButton={false}
      title="Revert Expense">
      <Group
        component="form"
        noValidate
        onSubmit={revertForm.onSubmit(revertExpense)}
        sx={{ width: "100%" }}
        direction="column"
        grow
        spacing={0}>
        <Text mb="sm">
          Are you sure you want to revert the following expense?
        </Text>
        {data && <ExpenseCard data={data} hideMenus />}
        <TextInput
          mb="md"
          size="sm"
          label="Revert Mesasge"
          required
          autoFocus
          placeholder="Add a Revert Message"
          {...revertForm.getInputProps("revertMsg")}
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
            size="xs"
            variant="subtle"
            leftIcon={<X size={18} />}
            onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="xs"
            variant="filled"
            color="red"
            loading={reverting}
            leftIcon={<ArrowBackUp size={18} />}>
            Revert
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
