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
  useDocumentTitle(`${APP_TITLE} | Download Report`);
  const [selection, setSelection] = useState([null, null]);
  const [view, setView] = useState("month");

  const { classes } = useStyles();
  const { userData } = useCurrentUser();
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
        `Report_${userData.userName.replace(" ", "_")}_${dayjs()
          .toDate()
          .toISOString()}.pdf`
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
      startDate: dayjs(selection[0]).startOf(view).toDate(),
      endDate: dayjs(selection[1]).endOf(view).toDate(),
    });
  };

  const handleViewChange = () => {
    setView((v) => (v === "month" ? "day" : "month"));
    setSelection([null, null]);
  };

  return (
    <Group position="center" sx={{ flexDirection: "column" }}>
      <Text>Select {view}s range to download report.</Text>
      {view === "day" ? (
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
          Select {view === "day" ? "month" : "day"}s
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
