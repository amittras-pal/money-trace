import { Box, Text } from "@mantine/core";
import React from "react";
import { currencyFormat } from "../../utils/formatter.utils";

export default function ChartTooltip({ active, payload }) {
  if (active && payload && payload?.length) {
    return (
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[6],
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          boxShadow: theme.shadows.md,
          zIndex: 999,
          // TODO: Make the border of the tooltip stand out
          // The Available budget one doesn't have a border, it seems.
          border: `1px solid ${payload[0].payload.color}`,
        })}>
        <Text size="xs" color="dimmed">
          {payload[0].name}
        </Text>
        <Text>{currencyFormat.format(payload[0].value)}</Text>
      </Box>
    );
  }
  return null;
}
