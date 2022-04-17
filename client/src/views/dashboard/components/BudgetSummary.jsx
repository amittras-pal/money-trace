import { Box, Button, Group, Progress, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { AlertTriangle, ChevronDown } from "tabler-icons-react";
import { MONTHLY_BUDGET } from "../../../constants/appConstants";
import { percentage, severityColor } from "../../../utils/app.utils";
import { currencyFormat, monthFormat } from "../../../utils/formatter.utils";

function BudgetSummary({ totalSpent, onToggleBreakdown, breakdownVisible }) {
  const isMobile = useMediaQuery("(max-width: 755px)");
  const spentPercentage = percentage(totalSpent, MONTHLY_BUDGET);

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${theme.colors.gray[3]}`,
        marginBottom: theme.spacing.sm,
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
      })}>
      <Group position="apart" sx={{ alignItems: "center" }} pb="sm">
        <Title
          order={isMobile ? 4 : 2}
          mb={0}
          sx={(theme) => ({ color: theme.colors.gray[7], fontWeight: 600 })}>
          {monthFormat.format(new Date())}
        </Title>
        <Button
          size="xs"
          rightIcon={<ChevronDown />}
          onClick={onToggleBreakdown}
          px={12}
          color="indigo"
          variant="light">
          {breakdownVisible ? "Hide" : "Show"} Breakdown
        </Button>
      </Group>
      <Text color="gray" mb={8} weight={600} ml="auto">
        Budget: {currencyFormat.format(MONTHLY_BUDGET)}
      </Text>
      <Progress
        color={severityColor(spentPercentage)}
        value={spentPercentage}
        size="sm"
      />
      <Group position="apart" mt={8}>
        <Group sx={{ alignItems: "center" }} spacing={0} ml="auto">
          <Text weight={600} color={severityColor(spentPercentage)}>
            Spent: {currencyFormat.format(totalSpent)}
          </Text>
          {spentPercentage > 100 && (
            <AlertTriangle
              size={16}
              color="red"
              style={{ marginLeft: "0.25rem", marginTop: "2px" }}
            />
          )}
        </Group>
      </Group>
    </Box>
  );
}

export default BudgetSummary;
