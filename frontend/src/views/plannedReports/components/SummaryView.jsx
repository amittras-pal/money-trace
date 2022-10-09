import { Box, Text } from "@mantine/core";
import React from "react";

export default function SummaryView() {
  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.dark[7],
        border: `1px solid ${theme.colors.dark[5]}`,
      })}>
      <Text>Add Summary View Here.</Text>
    </Box>
  );
}
