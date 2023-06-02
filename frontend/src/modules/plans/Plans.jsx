import { ActionIcon, Box, Loader, Modal, SimpleGrid } from "@mantine/core";
import React from "react";
import ExpensePlan from "./components/ExpensePlan";
import { useExpensePlans, useUpdatePlan } from "./services";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import ExpensePlanForm from "./components/ExpensePlanForm";
import DeletePlan from "./components/DeletePlan";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export default function Plans() {
  const { data, isLoading } = useExpensePlans(true);

  useDocumentTitle(`${APP_TITLE} | Expense Plans`);
  const { onError } = useErrorHandler();

  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);

  const [targetPlan, setTargetPlan] = useState(null);

  const client = useQueryClient();

  const handleModalClose = (refreshData) => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();

    if (refreshData)
      client.invalidateQueries({ queryKey: ["plans-list", true] });

    setTimeout(() => {
      setTargetPlan(null);
    }, 1000);
  };

  const { mutate: updatePlan } = useUpdatePlan({
    onSuccess: (res) => {
      notifications.show({
        message: res.data?.message,
        color: "green",
        icon: <IconCheck />,
      });
      handleModalClose(true);
    },
    onError,
  });

  if (isLoading)
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader size={80} />
      </Box>
    );

  const handlePlanAction = (data, mode) => {
    setTargetPlan(data);
    switch (mode) {
      case "edit":
        formModal.open();
        break;
      case "delete":
        deleteModal.open();
        break;
      case "close":
        modals.openConfirmModal({
          title: "Are you sure you want to close this expense plan?",
          closeOnCancel: true,
          centered: true,
          withCloseButton: false,
          children:
            "Once closed, no more expenses can be added to the plan and existing expenses cannot be modified.",
          labels: {
            confirm: "Close",
            cancel: "Cancel",
          },
          confirmProps: {
            color: "red",
            leftIcon: <IconX />,
          },
          onConfirm: () => {
            updatePlan({ ...data, open: false });
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <SimpleGrid
        cols={2}
        spacing="lg"
        breakpoints={[
          { maxWidth: "md", cols: 2, spacing: "sm", verticalSpacing: "sm" },
          { maxWidth: "sm", cols: 1, spacing: "sm", verticalSpacing: "sm" },
        ]}
      >
        {data.data.response?.map((plan) => (
          <ExpensePlan
            data={plan}
            key={plan._id}
            onPlanAction={handlePlanAction}
          />
        ))}
      </SimpleGrid>
      <ActionIcon
        size="xl"
        radius="xl"
        variant="filled"
        color={primaryColor}
        onClick={formModal.open}
        sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
      >
        <IconPlus size={24} />
      </ActionIcon>
      <Modal
        centered
        withOverlay
        opened={showForm || confirm}
        withCloseButton={false}
        onClose={handleModalClose}
      >
        {showForm && (
          <ExpensePlanForm data={targetPlan} onComplete={handleModalClose} />
        )}
        {confirm && (
          <DeletePlan data={targetPlan} onComplete={handleModalClose} />
        )}
      </Modal>
    </>
  );
}
