import {
  Badge,
  Box,
  Button,
  Group,
  Image,
  Modal,
  RingProgress,
  Text,
  useMantineTheme,
} from "@mantine/core";
import dayjs from "dayjs";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "tabler-icons-react";
import ExpenseForm from "../../components/expenseForm/ExpenseForm";
import LoaderOverlay from "../../components/LoaderOverlay";
import { CATEGORIES } from "../../constants/appConstants";
import { BudgetContext } from "../../context/budget.context";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useExpenseSummary } from "../../queries/expense.query";
import emptyState from "../../resources/illustrations/Clipboard.svg";
import { percentage } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";
import Last2Days from "./Last2Days";

function Dashboard() {
  const theme = useMantineTheme();
  const { onError } = useErrorHandler();
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };
  const { budget: defaultBudget } = useContext(BudgetContext);
  const { data, isLoading } = useExpenseSummary(
    new Date().getMonth() + 1,
    new Date().getFullYear(),
    {
      onError,
    }
  );

  const spentPercentage = percentage(data?.data?.response.total, defaultBudget);
  const getChartSections = () => {
    if (defaultBudget)
      return data?.data?.response?.categories.map((item) => ({
        value: percentage(
          item.value,
          spentPercentage >= 100 ? data?.data?.response.total : defaultBudget
        ),
        color: theme.colors[CATEGORIES[item.name].color][5],
      }));
    else return [{ value: 0, color: theme.colors.gray[3] }];
  };

  const recordedCategories = useMemo(() => {
    return data?.data?.response.categories?.map?.((item) => item.name) ?? [];
  }, [data?.data?.response]);

  const getCategoryAmount = useCallback(
    (category) => {
      return !recordedCategories.includes(category)
        ? "---"
        : currencyFormat.format(
            data?.data?.response.categories.find((o) => o.name === category)
              .value
          );
    },
    [data?.data?.response, recordedCategories]
  );

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[9],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.lg,
          height: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: `${
            data?.data?.response.total > 0 ? "space-between" : "center"
          }`,
          alignItems: "center",
          marginTop: theme.spacing.sm,
        })}>
        {isLoading ? (
          <LoaderOverlay />
        ) : data?.data?.response.total > 0 ? (
          <>
            <RingProgress
              size={275}
              thickness={50}
              sections={getChartSections()}
            />
            <Group
              direction="row"
              spacing="sm"
              position="center"
              grow
              sx={{ width: "100%" }}>
              <Group
                direction="column"
                spacing="sm"
                sx={() => ({ flexShrink: 1 })}>
                {Object.entries(CATEGORIES).map(([name]) => (
                  <Badge
                    color={CATEGORIES[name].color}
                    variant={
                      recordedCategories.includes(name) ? "filled" : "dot"
                    }
                    key={name}>
                    {name}: {getCategoryAmount(name)}
                  </Badge>
                ))}
              </Group>
              <Group
                direction="column"
                spacing={2}
                sx={() => ({
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  height: "100%",
                  flexGrow: 1,
                })}>
                <Text size="sm" color="blue" weight="bold" mb="lg">
                  Summary {dayjs().format("MMM, 'YY")}
                </Text>
                <Group spacing={4}>
                  <Text size="sm" weight="bold">
                    {currencyFormat.format(data?.data?.response.total)}
                  </Text>
                  <Text
                    size="sm"
                    weight="bold"
                    color={
                      defaultBudget
                        ? spentPercentage >= 100
                          ? "red"
                          : theme.colors.gray[5]
                        : theme.colors.gray[5]
                    }>
                    ({spentPercentage}%)
                  </Text>
                </Group>
                <Group spacing={4}>
                  <Text size="sm" color="orange">
                    of
                  </Text>
                  <Text
                    size="sm"
                    align="center"
                    color={defaultBudget ? theme.colors.gray[5] : "red"}
                    weight={500}>
                    {defaultBudget
                      ? currencyFormat.format(defaultBudget)
                      : "Budget not set."}
                  </Text>
                </Group>
                <Button
                  color="indigo"
                  size="xs"
                  variant="subtle"
                  pr={0}
                  component={Link}
                  to="/transactions"
                  rightIcon={<ArrowRight size={18} />}
                  onClick={() => setOpen(true)}
                  mt="auto">
                  View All
                </Button>
                <Button
                  color="indigo"
                  size="xs"
                  leftIcon={<Plus size={18} />}
                  onClick={() => setOpen(true)}
                  mt="auto">
                  Add New
                </Button>
              </Group>
            </Group>
          </>
        ) : (
          <>
            <Image src={emptyState} height={200} />
            <Text size="sm" mt="md">
              No transactions yet this month!
            </Text>
            <Group>
              <Button
                color="indigo"
                size="xs"
                leftIcon={<Plus size={18} />}
                onClick={() => setOpen(true)}
                mt="lg">
                Add New
              </Button>
              <Button
                color="indigo"
                size="xs"
                variant="subtle"
                pr={0}
                component={Link}
                to="/transactions"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => setOpen(true)}
                mt="auto">
                View Transactions
              </Button>
            </Group>
          </>
        )}
      </Box>
      <Last2Days />
      <Modal opened={open} onClose={closeModal} withCloseButton={false}>
        <ExpenseForm
          onComplete={closeModal}
          onCancel={closeModal}
          relatedQueries={[
            [
              "expense-summary",
              new Date().getMonth() + 1,
              new Date().getFullYear(),
            ],
            "last-two-days",
          ]}
        />
      </Modal>
    </>
  );
}

export default Dashboard;
