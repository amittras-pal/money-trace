import { Box, Button, Divider, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { getUserData, nonAuthErrorHandler } from "../../utils/app.utils";
import { Check, X } from "tabler-icons-react";
import { useUpdateUser } from "../../queries/auth.query";
import { useNotifications } from "@mantine/notifications";

function ActionBlock({ children, ...boxProps }) {
  return (
    <Box
      {...boxProps}
      sx={(theme) => ({
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor:
          theme.colorScheme === "light" ? "#fff" : theme.colors.gray[8],
        boxShadow: theme.shadows.sm,
        marginBottom: theme.spacing.sm,
        width: "100%",
      })}>
      {children}
    </Box>
  );
}

function User() {
  const budgetForm = useForm({
    initialValues: { defaultBudget: getUserData().defaultBudget || 0 },
  });
  const { showNotification } = useNotifications();

  const { mutate: update, isLoading } = useUpdateUser({
    onSuccess: (res) => {
      localStorage.setItem("userData", JSON.stringify(res.data.response));
      showNotification({
        message: res.data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: (err) => {
      nonAuthErrorHandler(err, () =>
        showNotification({
          title: "Login Failed",
          message: err.response.data.message,
          color: "red",
          icon: <X />,
        })
      );
    },
  });

  const updateDefaultBudget = (values) => {
    update({ update: values });
  };

  return (
    <Group direction="column">
      <ActionBlock>
        <Text size="lg" weight={500} color="indigo">
          Update Budget
        </Text>
        <Divider color="indigo" my={12} />
        <Group
          component="form"
          direction="column"
          onSubmit={budgetForm.onSubmit(updateDefaultBudget)}
          noValidate
          grow
          sx={{ width: "100%" }}>
          <TextInput
            size="sm"
            label="Default Budget"
            type="number"
            inputMode="numeric"
            placeholder="Enter Amount"
            {...budgetForm.getInputProps("defaultBudget")}
          />
          <Button
            ml="auto"
            leftIcon={<Check />}
            color="indigo"
            size="sm"
            loading={isLoading}
            type="submit">
            Update
          </Button>
        </Group>
      </ActionBlock>
    </Group>
  );
}

export default User;
