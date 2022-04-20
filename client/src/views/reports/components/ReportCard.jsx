import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import {
  Check,
  DotsVertical,
  Edit,
  SquareForbid,
  Trash,
  X,
} from "tabler-icons-react";
import { useDeleteReport, useEditReport } from "../../../queries/report.query";
import { nonAuthErrorHandler } from "../../../utils/app.utils";

function ReportCard({ data, hideMenus, onEdit }) {
  const { showNotification } = useNotifications();
  const { openConfirmModal } = useModals();

  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    client.invalidateQueries(["reports"]);
    showNotification({
      title: data.message || "Action was successful.",
      color: "green",
      icon: <Check />,
    });
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
  const { mutate: editReport } = useEditReport({
    onSuccess,
    onError,
  });
  const { mutate: deleteReport } = useDeleteReport({
    onSuccess,
    onError,
  });

  const confirmClose = (item) => {
    openConfirmModal({
      title: "Delete Expense",
      children: (
        <>
          <Text size="lg" weight={700}>
            Are you sure you want to close the following eport?
          </Text>
          <Box my={12}>
            <ReportCard data={item} hideMenus />
          </Box>
          <Text color="red" weight={500}>
            Once you close the report, no more expenses can be added to it. This
            change cannot be undone.
          </Text>
          <Divider variant="dashed" my="md" />
        </>
      ),
      labels: { confirm: "Close", cancel: "Cancel" },
      confirmProps: { leftIcon: <SquareForbid />, size: "sm", color: "red" },
      cancelProps: { leftIcon: <X />, size: "sm", color: "gray" },
      withCloseButton: false,
      onConfirm: () => {
        editReport({ reportId: data._id, open: false });
      },
    });
  };

  const confirmDelete = (item) => {
    openConfirmModal({
      title: "Delete Expense",
      children: (
        <>
          <Text size="lg" weight={700}>
            Are you sure you want to close the following eport?
          </Text>
          <Box my={12}>
            <ReportCard data={item} hideMenus />
          </Box>
          <Text color="red" weight={500}>
            Deleting a report will also delete all associated transactions. This
            action cannot be undone.
          </Text>
          <Divider variant="dashed" my="md" />
        </>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { leftIcon: <Trash />, size: "sm", color: "red" },
      cancelProps: { leftIcon: <X />, size: "sm", color: "gray" },
      withCloseButton: false,
      onConfirm: () => {
        deleteReport(item._id);
      },
    });
  };

  return (
    <Group
      noWrap
      py={8}
      px={12}
      position="apart"
      sx={(theme) => ({
        alignItems: "flex-start",
        textDecoration: "none",
        backgroundColor:
          theme.colorScheme === "light" ? "#fff" : theme.colors.gray[8],
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.sm,
        marginBottom: theme.spacing.sm,
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[2]
              : theme.colors.gray[7],
        },
        "&:before": {
          content: "''",
          height: "85%",
          width: 4,
          borderRadius: "4px",
          position: "absolute",
          top: "50%",
          left: 6,
          transform: "translateY(-50%)",
          backgroundColor: theme.colors[data.open ? "indigo" : "red"][5],
        },
      })}>
      <Box ml={8}>
        <Text
          component={Link}
          to={`/report/${data._id}`}
          weight={500}
          lineClamp={1}
          sx={(theme) => ({
            color:
              theme.colorScheme === "light"
                ? theme.colors.gray[8]
                : theme.colors.gray[3],
          })}>
          {data.name}
        </Text>
        <Text size="sm" color="dimmed">
          {data.description}
        </Text>
        <Group spacing={0} mt={8}>
          <Badge
            color={data.open ? "indigo" : "red"}
            variant="filled"
            size="sm"
            mr={8}>
            {data.open ? "Open" : "Closed"}
          </Badge>
          {/* <Badge color="gray" variant="light" size="sm">
            {day(data.expenseDate)}
          </Badge> */}
        </Group>
      </Box>
      {!hideMenus && (
        <Menu
          control={
            <ActionIcon variant="hover" color="gray" radius="xl" mt={4}>
              <DotsVertical size={16} />
            </ActionIcon>
          }>
          {!data.open ? (
            <Menu.Item
              color="red"
              icon={<Trash size={14} />}
              onClick={() => confirmDelete(data)}>
              Delete
            </Menu.Item>
          ) : (
            <>
              <Menu.Item icon={<Edit size={14} />} onClick={() => onEdit(data)}>
                Edit Report
              </Menu.Item>
              <Menu.Item
                icon={<SquareForbid size={14} />}
                onClick={() => confirmClose(data)}>
                Close Report
              </Menu.Item>
            </>
          )}
        </Menu>
      )}
    </Group>
  );
}

export default ReportCard;
