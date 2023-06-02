import { ActionIcon, Modal, Tabs, Text } from "@mantine/core";
import React, { useMemo, useState } from "react";
import PlanExpensesList from "./components/PlanExpensesList";
import PlanSummary from "./components/PlanSummary";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure, useDocumentTitle } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ExpenseForm from "../../components/ExpenseForm";
import DeleteExpense from "../../components/DeleteExpense";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { usePlanDetails } from "./services";

export default function PlanDetails() {
  const params = useParams();
  const [showForm, formModal] = useDisclosure(false);
  const [confirm, deleteModal] = useDisclosure(false);
  const [targetExpense, setTargetExpense] = useState(null);
  const client = useQueryClient();
  const { onError } = useErrorHandler();
  const payload = useMemo(
    () => ({
      sort: { date: -1 },
      plan: params.id,
    }),
    [params]
  );

  const { data: detailsRes } = usePlanDetails(params.id, { onError });
  useDocumentTitle(
    `${APP_TITLE} | Plan: ${detailsRes?.data?.response?.name ?? "Loading..."}`
  );

  const handleClose = (refreshData) => {
    if (showForm) formModal.close();
    if (confirm) deleteModal.close();
    if (refreshData) {
      client.invalidateQueries(["list", payload]);
      client.invalidateQueries(["summary", params.id]);
    }
    setTimeout(() => {
      setTargetExpense(null);
    }, 1000);
  };

  const handleExpenseAction = (data, mode) => {
    setTargetExpense(data);
    if (mode === "edit") formModal.open();
    else deleteModal.open();
  };

  const openCreateForm = () => {
    setTargetExpense({ plan: params.id });
    formModal.open();
  };

  return (
    <>
      <Text fw="bold">
        Plan:{" "}
        <Text component="span" color={primaryColor}>
          {detailsRes?.data?.response?.name ?? "Loading..."}
        </Text>
      </Text>
      <Tabs
        defaultValue="summary"
        keepMounted={false}
        sx={{ height: "calc(100% - 62px)" }}
      >
        <Tabs.List>
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="list">Expenses</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="summary" pt="xs">
          <PlanSummary />
        </Tabs.Panel>
        <Tabs.Panel value="list" pt="xs" sx={{ height: "100%" }}>
          <PlanExpensesList
            onExpenseAction={handleExpenseAction}
            plan={detailsRes?.data?.response}
          />
        </Tabs.Panel>
      </Tabs>
      {detailsRes?.data?.response?.open && (
        <ActionIcon
          size="xl"
          radius="xl"
          variant="filled"
          color={primaryColor}
          onClick={openCreateForm}
          sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
        >
          <IconPlus size={24} />
        </ActionIcon>
      )}
      <Modal
        centered
        opened={showForm || confirm}
        withCloseButton={false}
        onClose={handleClose}
        withOverlay
      >
        {showForm && (
          <ExpenseForm data={targetExpense} onComplete={handleClose} />
        )}
        {confirm && (
          <DeleteExpense data={targetExpense} onComplete={handleClose} />
        )}
      </Modal>
    </>
  );
}
