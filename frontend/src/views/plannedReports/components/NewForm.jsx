import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Divider,
  Group,
  SimpleGrid,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import { useErrorHandler } from "../../../hooks/errorHandler";
import {
  useCreateReport,
  useEditReport,
} from "../../../services/report.service";

export default function NewForm({ onComplete, onCancel, data }) {
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const { onError } = useErrorHandler();
  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    client.invalidateQueries(["reports"]);
    showNotification({
      title: data.message,
      color: "green",
      icon: <IconCheck />,
    });
    onComplete();
  };

  const handleError = (err) => {
    onError(err, () => {
      showNotification({
        title: err?.response?.data?.message,
        color: "red",
        icon: <IconX />,
      });
    });
  };

  const { mutate: addReport, isLoading: addingReport } = useCreateReport({
    onSuccess,
    onError: handleError,
  });
  const { mutate: editReport, isLoading: editingReport } = useEditReport({
    onSuccess,
    onError: handleError,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm({
    mode: "onChange",
    shouldFocusError: "true",
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup
          .string()
          .max(40, "Title should be 40 characters or less.")
          .required("Report Title is required"),
        description: yup
          .string()
          .max(260, "Description should be 260 characters or less.")
          .required("Report Description is required."),
      })
    ),
  });

  const saveReport = (values) => {
    if (!data) addReport(values);
    else {
      values.reportId = data._id;
      editReport(values);
    }
  };

  return (
    <SimpleGrid
      cols={1}
      component="form"
      noValidate
      onSubmit={handleSubmit(saveReport)}
      m={4}>
      <Divider color="indigo" mb="md" variant="dashed" />
      <TextInput
        label="Expense Name"
        required
        autoFocus
        {...register("name")}
        error={dirtyFields.name && touchedFields.name && errors.name?.message}
      />
      <Textarea
        label="Expense Description."
        required
        {...register("description")}
        error={
          dirtyFields.description &&
          touchedFields.description &&
          errors.description?.message
        }
      />
      <Group
        align="center"
        position={isSmallScreen ? "center" : "apart"}
        mb={8}
        grow>
        <Button
          type="button"
          variant="outline"
          color="gray"
          disabled={addingReport || editingReport}
          leftIcon={<IconX size={18} />}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={addingReport || editingReport}
          disabled={!isValid}
          leftIcon={<IconDeviceFloppy size={18} />}>
          Save
        </Button>
      </Group>
    </SimpleGrid>
  );
}
