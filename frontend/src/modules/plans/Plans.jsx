import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Loader,
  Modal,
  SimpleGrid,
  Text,
} from "@mantine/core";
import React, { useMemo } from "react";
import ExpensePlan from "./components/ExpensePlan";
import { useExpensePlans, useUpdatePlan } from "./services";
import { IconCheck, IconChecklist, IconPlus, IconX } from "@tabler/icons-react";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { useDisclosure, useDocumentTitle, useHotkeys } from "@mantine/hooks";
import ExpensePlanForm from "./components/ExpensePlanForm";
import DeletePlan from "./components/DeletePlan";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export default function Plans() {
  const { data, isLoading } = useExpensePlans(true);

  const plansList = useMemo(() => {
    const groups = { active: [], closed: [] };
    if (!data) return groups;
    data?.data?.response?.forEach((plan) => {
      if (plan.open) groups.active.push(plan);
      else groups.closed.push(plan);
    });
    return groups;
  }, [data]);

  useDocumentTitle(`${APP_TITLE} | Expense Plans`);
  const { onError } = useErrorHandler();

  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);
  useHotkeys([["N", formModal.open]]);

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
          children: (
            <>
              <Text color="red">
                Once closed, no more expenses can be added to the plan and
                existing expenses cannot be modified.
              </Text>
              <Alert title="Copying Expense" color={primaryColor} p="sm" mt={6}>
                After closing the plan will be able to select and copy expenses
                from this plan into your monthly budget.
              </Alert>
            </>
          ),
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

  if (!plansList.active.length && !plansList.closed.length)
    return (
      <>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconChecklist size={80} />
          <Text my="sm" align="center">
            No plans have been created!
          </Text>
          <Text size="sm" align="center" color="dimmed" mb="sm">
            Plans help you organize expenses which need to be tracked outside of
            your general monthly budget.
          </Text>
          <Button
            size="sm"
            mt="sm"
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              console.log("This is executed");
              formModal.open();
            }}
          >
            Create a plan
          </Button>
        </Box>
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

  return (
    <>
      {plansList.active?.length > 0 && (
        <>
          <Divider
            labelPosition="center"
            labelProps={{ color: "dimmed" }}
            label={`Open Plans (${plansList.active.length})`}
            mb="sm"
            color={primaryColor}
          />
          <SimpleGrid
            cols={2}
            spacing="lg"
            mb="sm"
            breakpoints={[
              { maxWidth: "md", cols: 2, spacing: "sm", verticalSpacing: "sm" },
              { maxWidth: "sm", cols: 1, spacing: "sm", verticalSpacing: "sm" },
            ]}
          >
            {plansList.active?.map((plan) => (
              <ExpensePlan
                data={plan}
                key={plan._id}
                onPlanAction={handlePlanAction}
              />
            ))}
          </SimpleGrid>
        </>
      )}
      {plansList.closed?.length > 0 && (
        <>
          <Divider
            labelPosition="center"
            labelProps={{ color: "dimmed" }}
            label={`Closed Plans (${plansList.closed.length})`}
            mb="sm"
            color="red"
          />
          <SimpleGrid
            cols={2}
            spacing="lg"
            mb="sm"
            breakpoints={[
              { maxWidth: "md", cols: 2, spacing: "sm", verticalSpacing: "sm" },
              { maxWidth: "sm", cols: 1, spacing: "sm", verticalSpacing: "sm" },
            ]}
          >
            {plansList.closed?.map((plan) => (
              <ExpensePlan
                data={plan}
                key={plan._id}
                onPlanAction={handlePlanAction}
              />
            ))}
          </SimpleGrid>
        </>
      )}
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
