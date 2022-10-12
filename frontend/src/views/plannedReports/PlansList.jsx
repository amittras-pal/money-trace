import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Image,
  Modal,
  ScrollArea,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import { useErrorHandler } from "../../hooks/errorHandler";
import noReports from "../../resources/NoReports.svg";
import {
  useDeleteReport,
  useEditReport,
  useReports,
} from "../../services/report.service";
import NewForm from "./components/NewForm";
import PlanCard from "./components/PlanCard";

export default function PlansList() {
  const [open, setOpen] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const { onError } = useErrorHandler();
  const client = useQueryClient();

  const onSuccess = ({ data }) => {
    client.invalidateQueries(["reports"]);
    showNotification({
      title: data.message || "Action was successful.",
      color: "green",
      icon: <IconCheck />,
    });
  };

  const handleError = (err) => {
    onError(err, () => {
      showNotification({
        title: err?.response?.data?.message,
        icon: <IconX />,
        color: "red",
      });
    });
  };

  const { data: reportsList, isLoading } = useReports(showAllPlans, {
    onError,
    refetchOnWindowFocus: false,
  });

  const { mutate: editReport } = useEditReport({
    onSuccess,
    onError: handleError,
  });
  const { mutate: deleteReport } = useDeleteReport({
    onSuccess,
    onError: handleError,
  });

  const closeFormModal = () => {
    if (selectedItem) setSelectedItem(null);
    setOpen(false);
  };

  const confirmClose = (item) => {
    openConfirmModal({
      title: "Close Expense Plan",
      children: (
        <>
          <Text size="lg" weight={700}>
            Are you sure you want to close the following expense plan?
          </Text>
          <Box my={12}>
            <PlanCard data={item} hideMenus flatten={true} />
          </Box>
          <Text color="red" weight={500}>
            Once you close the plan, no more expenses can be added to it. This
            change cannot be undone.
          </Text>
          <Divider variant="dashed" my="md" />
        </>
      ),
      labels: { confirm: "Close", cancel: "Keep Open" },
      confirmProps: { size: "sm", color: "red", m: 4 },
      cancelProps: { size: "sm", color: "gray", m: 4 },
      withCloseButton: false,
      closeOnCancel: true,
      onConfirm: () => {
        editReport({ reportId: item._id, open: false });
      },
    });
  };

  const confirmDelete = (item) => {
    openConfirmModal({
      title: "Delete Expense Plan",
      children: (
        <Box m={4}>
          <Text size="lg" weight={700}>
            Are you sure you want to delete the following Expense Plan?
          </Text>
          <Box my={12}>
            <PlanCard data={item} hideMenus flatten={true} />
          </Box>
          <Text color="red" weight={500}>
            Deleting an expense plan will also delete all associated
            transactions. This action cannot be undone.
          </Text>
          <Divider variant="dashed" my="md" />
        </Box>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { size: "sm", color: "red", m: 4 },
      cancelProps: { size: "sm", color: "gray", m: 4 },
      withCloseButton: false,
      closeOnCancel: true,
      onConfirm: () => {
        deleteReport(item._id);
      },
    });
  };

  return (
    <>
      <Switch
        size="sm"
        mb="md"
        label={`Show ${showAllPlans ? "Open" : "All"}`}
        radius="xs"
        onLabel="All"
        offLabel="Open"
        checked={showAllPlans}
        onChange={(e) => setShowAllPlans(e.currentTarget.checked)}
      />
      {isLoading ? (
        <CenteredLoader />
      ) : (
        <>
          {reportsList?.data?.response?.length > 0 ? (
            <ScrollArea style={{ height: "calc(100vh - 130px)" }}>
              <SimpleGrid
                cols={isMobile ? 1 : 3}
                spacing="md"
                verticalSpacing="sm">
                {reportsList?.data?.response.map((plan) => (
                  <PlanCard
                    data={plan}
                    key={plan._id}
                    onClose={confirmClose}
                    onDelete={confirmDelete}
                    onEdit={(data) => {
                      setSelectedItem(data);
                      setOpen(true);
                    }}
                  />
                ))}
              </SimpleGrid>
            </ScrollArea>
          ) : (
            <Group
              sx={(theme) => ({ flexDirection: "column" })}
              align="center"
              mt={64}>
              <Image src={noReports} width={isMobile ? 240 : 480} />
              <Text color="dimmed" size="sm" align="center">
                You do not have any {showAllPlans ? "" : "open"} expense plans.
              </Text>
              <Text color="dimmed" size="sm" align="center">
                Use expense plans to manage expenses which are outside of your
                month's budget, like a vacation trip...
              </Text>
            </Group>
          )}
        </>
      )}

      <Tooltip position="top-end" label="Create new Expense Plan">
        <ActionIcon
          onClick={() => setOpen(true)}
          size="xl"
          color="indigo"
          variant="filled"
          radius="xl"
          sx={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 0,
          }}>
          <IconPlus size={24} />
        </ActionIcon>
      </Tooltip>
      <Modal
        opened={open || selectedItem}
        onClose={closeFormModal}
        withCloseButton={false}
        title="Create New Expense Plan"
        closeOnClickOutside={false}>
        <NewForm
          data={selectedItem}
          onComplete={closeFormModal}
          onCancel={closeFormModal}
        />
      </Modal>
    </>
  );
}
