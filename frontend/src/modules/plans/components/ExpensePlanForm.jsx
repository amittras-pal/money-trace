import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Group,
  Text,
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { useForm } from "react-hook-form";
import { expensePlanSchema } from "../utils";
import { useCreatePlan, useUpdatePlan } from "../services";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export default function ExpensePlanForm({ data, onComplete }) {
  const { primaryColor } = useMantineTheme();
  const { onError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
    resolver: yupResolver(expensePlanSchema),
  });

  const handleSuccess = (res) => {
    notifications.show({
      message: res.data?.message,
      color: "green",
      icon: <IconCheck />,
    });
    onComplete(res.data?.response ?? true);
    reset();
  };

  const { mutate: createPlan, isLoading: creating } = useCreatePlan({
    onSuccess: handleSuccess,
    onError,
  });

  const { mutate: updatePlan, isLoading: updating } = useUpdatePlan({
    onSuccess: handleSuccess,
    onError,
  });

  const handleClose = () => {
    onComplete(null);
    reset();
  };

  const handleSave = (values) => {
    const payload = Object.assign({}, values);
    if (data) updatePlan({ ...payload, _id: data._id, open: true });
    else createPlan(payload);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSave)}
      onReset={handleClose}
    >
      <Text fz="lg" fw="bold" c={primaryColor} mb="sm">
        {data ? "Edit Plan" : "Create New Plan"}
      </Text>
      <Divider />
      <Box>
        <TextInput
          {...register("name")}
          error={errors.name?.message}
          placeholder="Plan Title"
          label="Plan Title"
          required
        />
        <Textarea
          {...register("description")}
          error={errors.description?.message}
          placeholder="Plan Description"
          label="Plan Description"
          minRows={5}
          required
        />
        <Text size="xs" color="dimmed" ta="right">
          {watch("description")?.length} / 400
        </Text>
      </Box>
      <Group grow mt="md">
        <Button type="reset" variant="outline" disabled={creating || updating}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={creating || updating}
          disabled={!isValid}
        >
          Save
        </Button>
      </Group>
    </Box>
  );
}
