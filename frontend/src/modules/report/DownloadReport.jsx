import {
  Button,
  Checkbox,
  Group,
  SegmentedControl,
  createStyles,
} from "@mantine/core";
import { DatePicker, MonthPicker } from "@mantine/dates";
import { useDocumentTitle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { useCurrentUser } from "../../context/user";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useDownloadReport } from "./services";
import { downloadFile } from "./utils/downloadFile";

export default function DownloadReport() {
  useDocumentTitle(`${APP_TITLE} | Download Report`);
  const [selection, setSelection] = useState([null, null]);
  const [includeList, setIncludeList] = useState(false);
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
      // setSelection([null, null]);
    },
    onError,
  });

  const handleDownload = () => {
    download({
      startDate: dayjs(selection[0]).startOf(view).toDate(),
      endDate: dayjs(selection[1]).endOf(view).toDate(),
      includeList,
    });
  };

  return (
    <Group position="center">
      <Group position="center" sx={{ maxWidth: 290, flexDirection: "column" }}>
        <SegmentedControl
          size="sm"
          value={view}
          color={primaryColor}
          onChange={setView}
          sx={{ width: "100%" }}
          data={[
            { label: "Dates Range", value: "day" },
            { label: "Months Range", value: "month" },
          ]}
        />
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
        <Checkbox
          checked={includeList}
          onChange={(e) => setIncludeList(e.currentTarget.checked)}
          label="Include Expenses List"
        />
        <Button
          fullWidth
          disabled={!selection[0] || !selection[1]}
          leftIcon={<IconDownload size={16} />}
          onClick={handleDownload}
          loading={isLoading}
        >
          Download
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
