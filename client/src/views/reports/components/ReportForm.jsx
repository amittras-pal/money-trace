import React from "react";
import { useNotifications } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import { Check, DeviceFloppy, X } from "tabler-icons-react";
import { nonAuthErrorHandler } from "../../../utils/app.utils";
import { useCreateReport, useEditReport } from "../../../queries/report.query";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { Button, Divider, Group, Text, TextInput } from "@mantine/core";

function ReportForm({ onComplete, onCancel, data = null }) {
  const { showNotification } = useNotifications();
  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    client.invalidateQueries(["reports"]);
    showNotification({
      title: data.message,
      color: "green",
      icon: <Check />,
    });
    onComplete();
  };

  const onError = (err) => {
    nonAuthErrorHandler(err, () => {
      showNotification({
        title: err.response.message,
        color: "red",
        icon: <X />,
      });
    });
  };

  const { mutate: addReport, isLoading: addingReport } = useCreateReport({
    onSuccess,
    onError,
  });
  const { mutate: editReport, isLoading: editingReport } = useEditReport({
    onSuccess,
    onError,
  });

  const reportForm = useForm({
    initialValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
    schema: yupResolver(
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
    if (!data) {
      addReport(values);
    } else {
      values.reportId = data._id;
      editReport(values);
    }
  };

  return (
    <Group
      direction="column"
      component="form"
      noValidate
      onSubmit={reportForm.onSubmit(saveReport)}
      sx={{ width: "100%" }}
      grow
      spacing={0}>
      <Text color="indigo" size="lg" weight={500}>
        {data ? "Update Report" : "Create a new Report"}
      </Text>
      <Divider color="indigo" my={12} />
      <TextInput
        {...reportForm.getInputProps("name")}
        size="sm"
        label="Report Title"
        required
        placeholder="Report Title"
        mb={12}
      />
      <TextInput
        {...reportForm.getInputProps("description")}
        required
        size="sm"
        label="Report Description"
        placeholder="Report Description"
        mb={12}
      />

      <Divider variant="dashed" color="indigo" mb={12} />
      <Group position="right">
        <Button
          type="button"
          size="sm"
          variant="light"
          color="indigo"
          leftIcon={<X />}
          onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="filled"
          color="indigo"
          loading={addingReport || editingReport}
          leftIcon={<DeviceFloppy />}>
          Save
        </Button>
      </Group>
    </Group>
  );
}

export default ReportForm;
