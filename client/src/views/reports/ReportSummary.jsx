import { Badge, Group, RingProgress, Text } from "@mantine/core";
import React from "react";
import { CATEGORIES } from "../../constants/appConstants";
import { percentage } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

function ReportSummary({ summary, total, onBadgeClick }) {
  return (
    <Group
      position="center"
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[9],
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        boxShadow: theme.shadows.md,
        flexDirection: "column",
      })}>
      <RingProgress
        sections={Object.entries(summary).map(([category, amount]) => ({
          value: percentage(amount, total),
          color: CATEGORIES[category].color,
        }))}
        size={255}
        thickness={16}
        label={
          <Text size="lg" weight="bold" align="center">
            {currencyFormat.format(total)}
          </Text>
        }
      />
      <Group direction="row" spacing="sm" position="center">
        {Object.entries(CATEGORIES).map(([name]) => (
          <Badge
            color={CATEGORIES[name].color}
            variant={summary[name] ? "filled" : "dot"}
            key={name}
            onClick={() => {
              if (summary[name]) onBadgeClick(name);
            }}>
            {name}:{" "}
            {summary[name] ? currencyFormat.format(summary[name]) : "---"}
          </Badge>
        ))}
      </Group>
    </Group>
  );
}

export default ReportSummary;
