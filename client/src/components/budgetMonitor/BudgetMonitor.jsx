import { Box, Button, Divider, Modal, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Check, DeviceFloppy, X } from "tabler-icons-react";
import * as yup from "yup";
import { BudgetContext } from "../../context/budget.context";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useAddBudget, useBudget } from "../../queries/budget.query";

function BudgetMonitor() {
  const [openModal, setOpenModal] = useState(false);
  const { setBudget } = useContext(BudgetContext);
  const { showNotification } = useNotifications();
  const { onError } = useErrorHandler();

  const {
    isLoading: loadingBudget,
    error,
    data,
  } = useBudget(new Date().getMonth() + 1, new Date().getFullYear(), {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const { mutate: saveBudget, isLoading: savingBudget } = useAddBudget({
    onSuccess: ({ data }) => {
      setBudget(data?.response);
      setOpenModal(false);
      showNotification({
        message: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: (err) =>
      onError(err, () => {
        showNotification({
          title: err.response?.data?.message,
          color: "red",
          icon: <X />,
        });
      }),
  });

  useEffect(() => {
    if (!loadingBudget && error?.response?.status === 404) {
      setOpenModal(true);
    } else if (data?.data?.response) {
      setBudget(data?.data?.response?.amount);
    }
  }, [loadingBudget, error, data, setBudget]);

  const budgetForm = useForm({
    initialValues: {
      amount: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
    schema: yupResolver(
      yup.object().shape({
        amount: yup
          .number()
          .min(1, "Amount is required.")
          .required("Amount is required."),
      })
    ),
  });

  return (
    <Modal
      centered
      size="lg"
      opened={openModal}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}>
      <Text size="lg">
        Budget is not set for {dayjs().format("MMMM, YYYY")}.
      </Text>
      <Text color="dimmed">
        Please set a budget for this month to continue further.
      </Text>
      <Divider variant="dashed" color="indigo" my={12} />
      <Box
        component="form"
        noValidate
        onSubmit={budgetForm.onSubmit(saveBudget)}>
        <TextInput
          size="sm"
          mb={12}
          placeholder="Budget Amount"
          label="Amount"
          required
          {...budgetForm.getInputProps("amount")}
        />
        <Button
          color="indigo"
          size="sm"
          type="submit"
          mr={4}
          mb={4}
          leftIcon={<DeviceFloppy />}
          loading={savingBudget}>
          Save
        </Button>
      </Box>
    </Modal>
  );
}

export default BudgetMonitor;
