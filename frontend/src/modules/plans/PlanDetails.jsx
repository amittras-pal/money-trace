import { ActionIcon, Modal, Tabs } from "@mantine/core";
import { useDisclosure, useDocumentTitle, useHotkeys } from "@mantine/hooks";
import { IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteExpense from "../../components/DeleteExpense";
import ExpenseForm from "../../components/ExpenseForm";
import { APP_TITLE, primaryColor } from "../../constants/app";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import PlanDetailsPanel from "./components/PlanDetailsPanel";
import PlanExpensesList from "./components/PlanExpensesList";
import PlanSummary from "./components/PlanSummary";
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
      client.invalidateQueries(["plan-details", params.id]);
    }

    setTimeout(() => {
      setTargetExpense(null);
    }, 500);
  };

  const handleExpenseAction = (data, mode) => {
    setTargetExpense(data);
    switch (mode) {
      case "edit":
        formModal.open();
        break;
      case "delete":
        deleteModal.open();
        break;
      default:
        break;
    }
  };

  const openCreateForm = () => {
    setTargetExpense({ plan: params.id });
    formModal.open();
  };

  useHotkeys([["N", openCreateForm]]);

  return (
    <>
      <Tabs
        defaultValue="summary"
        keepMounted={false}
        sx={{ height: "calc(100% - 62px)" }}
      >
        <Tabs.List>
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="list">Expenses</Tabs.Tab>
          <Tabs.Tab
            value="info"
            ml="auto"
            icon={<IconInfoCircle size={16} />}
          />
        </Tabs.List>

        <Tabs.Panel value="summary" pt="xs" sx={{ height: "100%" }}>
          <PlanSummary />
        </Tabs.Panel>
        <Tabs.Panel value="list" pt="xs" sx={{ height: "100%" }}>
          <PlanExpensesList
            onExpenseAction={handleExpenseAction}
            plan={detailsRes?.data?.response}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info" pt="xs" sx={{ height: "100%" }}>
          <PlanDetailsPanel data={detailsRes?.data?.response ?? {}} />
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
