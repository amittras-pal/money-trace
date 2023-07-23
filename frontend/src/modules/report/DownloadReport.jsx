import { Button, Group, Text, createStyles } from "@mantine/core";
import { DatePicker, MonthPicker } from "@mantine/dates";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { APP_TITLE } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import { useDownloadReport } from "./services";
import { downloadFile } from "./utils/downloadFile";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export default function DownloadReport() {
  const [selection, setSelection] = useState([null, null]);
  const [view, setView] = useState("month");
  const { classes } = useStyles();
  const { userData } = useCurrentUser();
  useDocumentTitle(`${APP_TITLE} | Download Report`);
  const { onError } = useErrorHandler();

  const pickerProps = useMemo(
    () => ({
      className: classes.wrapper,
      allowDeselect: true,
      type: "range",
      maxDate: dayjs().toDate(),
      minDate: userData
        ? dayjs(userData?.createdAt).toDate()
        : dayjs().toDate(),
    }),
    [classes.wrapper, userData]
  );

  const { mutate: download, isLoading } = useDownloadReport({
    onSuccess: (res) => {
      downloadFile(
        res.data,
        `Report_${userData.userName.replace(" ", "_")}_${dayjs().format(
          "DD-MM-YY-hh-MM-ss"
        )}`
      );
      notifications.show({
        title: "Report Downloaded Successfully!",
        color: "green",
        icon: <IconDownload size={16} />,
      });
      setSelection([null, null]);
    },
    onError,
  });

  const handleDownload = () => {
    download({
      startDate:
        view === "date"
          ? selection[0]
          : dayjs(selection[0]).startOf("month").toDate(),
      endDate:
        view === "date"
          ? selection[1]
          : dayjs(selection[1]).endOf("month").toDate(),
    });
  };

  const handleViewChange = () => {
    setView((v) => (v === "month" ? "date" : "month"));
    setSelection([null, null]);
  };

  return (
    <Group position="center" sx={{ flexDirection: "column" }}>
      <Text>Select {view} range to download report.</Text>
      {view === "date" ? (
        <DatePicker
          {...pickerProps}
          value={selection}
          onChange={setSelection}
        />
      ) : (
        <MonthPicker
          {...pickerProps}
          value={selection}
          onChange={setSelection}
        />
      )}
      <Group spacing="sm">
        <Button
          disabled={!selection[0] || !selection[1]}
          leftIcon={<IconDownload size={16} />}
          onClick={handleDownload}
          loading={isLoading}
        >
          Download
        </Button>
        <Button onClick={handleViewChange} variant="outline">
          Select {view === "month" ? "date" : "month"}s
        </Button>
      </Group>
    </Group>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
    border: "1px solid",
    borderColor: theme.colors.gray[8],
    padding: theme.spacing.md,
  },
}));
